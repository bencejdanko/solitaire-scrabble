from flask import (
    Flask, render_template, redirect, url_for, request, session, 
    url_for, Blueprint, flash, g, )

from solitaire_scrabble.db import get_db

import jwt
key = 'verysecretkey'

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register', methods = ('GET', 'POST'))
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        db = get_db()
        error = None

        if not username:
            error = 'Username required.'
        
        elif not password:
            error = 'Password required.'
        
        if error is None:
            try:
                db.execute(
                    "INSERT INTO user (username, password, score) VALUES (?, ?, ?)",
                    (username, password, 0)
                )
                db.commit()
            except db.IntegrityError:
                error = f'User {username} is already registered.'
            else:
                return redirect(url_for("auth.login"))
        
        flash(error)
    return render_template('auth/register.html')

@bp.route('/login', methods=('GET', 'POST'))
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        db = get_db()
        error = None
        user = db.execute(
            'SELECT * FROM user WHERE username = ?', (username,)
        ).fetchone()

        if user is None:
            error = f'No associated user {username}.'

        elif password != user['password']:
            error = 'Incorrect password.'

        if error is None:
            encoded_jwt = jwt.encode({'user_id': user['id'], 'username': username}, key, algorithm='HS256')
            response = redirect(url_for('index'))
            response.set_cookie('user', encoded_jwt)
            return response
        
        flash(error)
    return render_template('auth/login.html')

@bp.route('/logout')
def logout():
    response = redirect(url_for('index'))
    response.set_cookie('user', '', expires=0)
    return response