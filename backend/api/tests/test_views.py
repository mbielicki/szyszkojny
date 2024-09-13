from django.test import TestCase, Client
from django.urls import reverse

from api.models import User

class TestViews(TestCase):
    def setUp(self):
        self.client = Client()

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
