from api.utils import now
from django.test import TestCase
from api.models import User, Code, Transaction

class UserModelTestCase(TestCase):
    def test_user_creation(self):
        user = User.objects.create(
            uid='test_uid',
            username='test_username',
            role='U'
        )
        self.assertEqual(user.uid, 'test_uid')
        self.assertEqual(user.username, 'test_username')
        self.assertEqual(user.role, 'U')

    def test_user_str_representation(self):
        user = User.objects.create(
            uid='test_uid',
            username='test_username',
            role='U'
        )
        self.assertEqual(str(user), 'test_username')

class CodeModelTestCase(TestCase):
    def test_code_creation(self):
        code = Code.objects.create(
            code='test_code',
            issuer=User.objects.create(uid='test_uid', username='test_username', role='U'),
            money=100,
            description='Test code',
            activates=now(),
            expires=now(d_days=1)
        )
        self.assertEqual(code.code, 'test_code')
        self.assertEqual(code.issuer.username, 'test_username')
        self.assertEqual(code.money, 100)
        self.assertEqual(code.description, 'Test code')

    def test_code_is_valid(self):
        code = Code.objects.create(
            code='test_code',
            issuer=User.objects.create(uid='test_uid', username='test_username', role='U'),
            money=100,
            description='Test code',
            activates=now(),
            expires=now(d_days=1)
        )
        self.assertTrue(code.is_valid())

    def test_code_expired(self):
        code = Code.objects.create(
            code='test_code',
            issuer=User.objects.create(uid='test_uid', username='test_username', role='U'),
            money=100,
            description='Test code',
            activates=now(d_days=-2),
            expires=now(d_days=-1)
        )
        self.assertFalse(code.is_valid())

    def test_code_not_activated(self):
        code = Code.objects.create(
            code='test_code',
            issuer=User.objects.create(uid='test_uid', username='test_username', role='U'),
            money=100,
            description='Test code',
            activates=now(d_days=1),
            expires=now(d_days=2)
        )
        self.assertFalse(code.is_valid())

class TransactionModelTestCase(TestCase):
    def test_transaction_creation(self):
        user = User.objects.create(uid='test_uid', username='test_username', role='U')
        code = Code.objects.create(
            code='test_code',
            issuer=user,
            money=100,
            description='Test code',
            activates=now(),
            expires=now(d_days=1)
        )
        timestamp = now()
        transaction = Transaction.objects.create(
            receiver=user,
            code=code,
            timestamp=timestamp
        )
        self.assertEqual(transaction.receiver.username, 'test_username')
        self.assertEqual(transaction.code.code, 'test_code')
        self.assertEqual(transaction.timestamp, timestamp)