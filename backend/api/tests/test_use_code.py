from django.test import TestCase, Client
from django.urls import reverse
from pytz import timezone

from api.models import Code, Transaction, User
from api.utils import from_now
from szyszkojny import settings

class TestUseCodeView(TestCase):
    def setUp(self):
        self.client = Client()

    
    def test_use_code(self):
        user = User.objects.create(uid='test_uid', username='test_name', role='U')
        code = Code.objects.create(code='test_code', issuer=user, money=10, description='test_description', activates=from_now(), expires=from_now(d_minutes=5))
        response = self.client.post(reverse('use-code'), {
            'id_token': 'test_id_token',
            'code': code.code
        }, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        
    def test_use_code_invalid_id_token(self):
        response = self.client.post(reverse('use-code'), {
            'id_token': 'invalid_id_token',
            'code': 'test_code'
        }, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        
    def test_use_code_code_not_found(self):
        response = self.client.post(reverse('use-code'), {
            'id_token': 'test_id_token',
            'code': 'test_code'
        }, content_type='application/json')
        self.assertEqual(response.status_code, 404)
        self.assertJSONEqual(response.content, {
            'error': 'Code not found'
        })
        
    def test_use_code_code_expired(self):
        user = User.objects.create(uid='test_uid', username='test_name', role='U')
        code = Code.objects.create(code='test_code', issuer=user, money=10, description='test_description', activates=from_now(), expires=from_now(d_minutes=-1))
        response = self.client.post(reverse('use-code'), {
            'id_token': 'test_id_token',
            'code': code.code
        }, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {
            'error': 'Code expired',
            'expires': code.expires.astimezone(timezone(settings.TIME_ZONE)).isoformat()
        })
        
    def test_use_code_code_not_activated(self):
        user = User.objects.create(uid='test_uid', username='test_name', role='U')
        code = Code.objects.create(code='test_code', issuer=user, money=10, description='test_description', activates=from_now(d_minutes=5), expires=from_now(d_minutes=10))
        response = self.client.post(reverse('use-code'), {
            'id_token': 'test_id_token',
            'code': code.code
        }, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {
            'error': 'Code not activated',
            'activates': code.activates.astimezone(timezone(settings.TIME_ZONE)).isoformat()
        })
        
    def test_use_code_code_used_up(self):
        user = User.objects.create(uid='test_uid', username='test_name', role='U')
        code = Code.objects.create(code='test_code', issuer=user, money=10, description='test_description', use_limit=1)
        
        # Use once
        response = self.client.post(reverse('use-code'), {
            'id_token': 'test_id_token',
            'code': code.code
        }, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        # Use again
        response = self.client.post(reverse('use-code'), {
            'id_token': 'test_id_token',
            'code': code.code
        }, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {
            'error': 'Code used up',
            'use_limit': code.use_limit,
            'use_count': 1
        })
        
    def test_use_code_used_up_for_user(self):
        user = User.objects.create(uid='test_uid', username='test_name', role='U')
        code = Code.objects.create(code='test_code', issuer=user, money=10, description='test_description', per_person_limit=1)
        Transaction.objects.create(receiver=user, code=code)
        response = self.client.post(reverse('use-code'), {
            'id_token': 'test_id_token',
            'code': code.code
        }, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {
            'error': 'Code used up for you',
            'per_person_limit': code.per_person_limit,
            'used_by_you': 1
        })
        
    def test_use_code_not_enough_money(self):
        user = User.objects.create(uid='test_uid', username='test_name', role='U', money=5)
        code = Code.objects.create(code='test_code', issuer=user, money=-10, description='test_description')
        response = self.client.post(reverse('use-code'), {
            'id_token': 'test_id_token',
            'code': code.code
        }, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {
            'error': 'Not enough money',
            'your_money': user.money,
            'code_money': code.money
        })
