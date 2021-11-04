import pomodoro_routing
import pytest
import sys
import os
topdir = os.path.join(os.path.dirname(__file__), '..')
sys.path.append(topdir)
from Pomodoro import *




#Test to ensure that pytest is working
def test_working():
    assert True

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True

    with app.app_context():
        with app.test_client() as client:
            yield client

######Test to ensure main page can load##########
def test_main_page():
    client = pomodoro.test_client()
    response = client.get('/')
    assert response.status_code == 200





