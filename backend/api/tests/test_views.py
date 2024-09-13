from django.test import TestCase, Client
from django.urls import reverse

from api.models import User

class TestViews(TestCase):
    def setUp(self):
        self.client = Client()

    def test_add_user(self):
        response = self.client.post(reverse('sign-up'), {
            'uid': 'test_uid',
            'username': 'test_username',
            'role': 'U'
        }, content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_add_user_invalid(self):
        response = self.client.post(reverse('sign-up'), {
            'uid': 'test_uid',
            'username': '',
            'role': 'U'
        }, content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_get_user(self):
        user = User.objects.create(
            uid='test_uid',
            username='test_username',
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
