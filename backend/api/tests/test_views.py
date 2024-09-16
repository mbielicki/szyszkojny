from django.test import TestCase, Client
from django.urls import reverse

from api.models import Code, User
from api.utils import from_now
from szyszkojny import settings
from pytz import timezone

class TestViews(TestCase):
    def setUp(self):
        self.client = Client()

    def test_add_user(self):
        response = self.client.post(reverse('log-in'), {
            'id_token': 'test_id_token'
        }, content_type='application/json')
        self.assertIn(response.status_code, [201, 200])

    def test_add_user_invalid(self):
        response = self.client.post(reverse('log-in'), {
            'id_token': 'test_id_token_invalid'
        }, content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_get_user(self):
        user = User.objects.create(
            uid='test_uid',
            username='test_name',
            role='U'
        )
        response = self.client.get(reverse('get-user', args=[user.uid]))
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {
            'uid': user.uid,
            'username': user.username,
            'role': user.role,
            'money': 0
        })

    def test_get_user_not_found(self):
        response = self.client.get(reverse('get-user', args=['test_uid']))
        self.assertEqual(response.status_code, 404)

    def test_make_qr(self):
        user = User.objects.create(
            uid='test_uid',
            username='test_name',
            role='U',
            money=100
        )

        data = {
            'id_token': 'test_id_token',
            'code_params': {
                'money': 10,
                'description': 'test_description',
                'per_person_limit': 10,
                'use_limit': 1,
                'activates': str(from_now()),
                'expires': str(from_now(d_minutes=5)),
            }
        }
        response = self.client.post(reverse('make-qr'), data, content_type='application/json')
        self.assertEqual(response.status_code, 201)

    
    def test_my_codes(self):
        user = User.objects.create(
            uid='test_uid',
            username='test_name',
            role='U'
        )
        code = Code.objects.create(
            issuer=user,
            money=10,
            description='test_description',
            per_person_limit=10,
            use_limit=1,
            activates=from_now(),
            expires=from_now(d_minutes=5),
        )
        response = self.client.post(reverse('my-codes'), {
            'id_token': 'test_id_token'
        }, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {
            'results': [
                {
                    'code': code.code,
                    'issuer': user.uid,
                    'money': code.money,
                    'description': code.description,
                    'per_person_limit': code.per_person_limit,
                    'use_limit': code.use_limit,
                    'activates': code.activates.astimezone(timezone(settings.TIME_ZONE)).isoformat(),
                    'expires': code.expires.astimezone(timezone(settings.TIME_ZONE)).isoformat(),
                }
            ]
        })


    def test_my_codes_invalid_id_token(self):
        response = self.client.post(reverse('my-codes'), {
            'id_token': 'invalid_id_token'
        }, content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_my_codes_no_codes(self):
        Code.objects.all().delete()
        response = self.client.post(reverse('my-codes'), {
            'id_token': 'test_id_token'
        }, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {
            'results': []
        })

    def test_get_code(self):
        user = User.objects.create(
            uid='test_uid',
            username='test_name',
            role='U'
        )
        code = Code.objects.create(
            code='test_code',
            issuer=user,
            money=10,
            description='test_description',
            per_person_limit=10,
            use_limit=1,
        )
        response = self.client.get(reverse('get-code', args=[code.code]))
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {
            'code': code.code,
            'issuer': user.uid,
            'money': code.money,
            'description': code.description,
            'per_person_limit': code.per_person_limit,
            'use_limit': code.use_limit,
            'activates': code.activates.astimezone(timezone(settings.TIME_ZONE)).isoformat(),
            'expires': code.expires.astimezone(timezone(settings.TIME_ZONE)).isoformat(),
        })
