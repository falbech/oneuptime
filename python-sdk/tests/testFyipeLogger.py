import unittest
from faker import Faker
import requests
from fyipe_sdk.logger import FyipeLogger
# target = __import__("src/logger.py")
# logger = target.logger



class LoggerTest(unittest.TestCase):

    def setUp(self):
        self.apiUrl = 'http://localhost:3002/api'
        self.fake = Faker()
        self.setUserObject()
        try:
            # create user
            createdUser = self.apiRequest(self.apiUrl+'/user/signup', self.user, {})

            # get token and project
            token = createdUser['tokens']['jwtAccessToken']
            self.header = {
                'Authorization': 'Basic '+ token
            }
            self.project = createdUser['project']

            # create a component
            component = {'name': self.fake.word()};
            createdComponent = self.apiRequest(self.apiUrl+'/component/'+self.project['_id'], component, self.header)
            self.component = createdComponent

            # create an applicationlog and set it as the global application Log.
            appLog = {'name': self.fake.word()};
            createdApplicationLog = self.apiRequest(self.apiUrl+ '/application-log/'+self.project['_id']+'/'+createdComponent['_id']+'/create', appLog, self.header)
            self.applicationLog = createdApplicationLog


        except requests.exceptions.HTTPError as error:
            print("Couldnt create an application log to run a test, Error occured: ")
            print(error)


    
    def setUserObject(self):
        self.user = {
            'name': self.fake.name(),
            'password': '1234567890',
            'confirmPassword': '1234567890',
            'email': self.fake.ascii_company_email(),
            'companyName': self.fake.company(),
            'jobRole': self.fake.job(),
            'companySize': self.fake.random_int(),
            'card': { 
                'stripeToken': 'tok_visa'
            },
            'subscription': {
                'stripePlanId': 0
            },
            'cardName': self.fake.credit_card_provider(),
            'cardNumber': self.fake.credit_card_number(),
            'cvv': self.fake.credit_card_security_code(),
            'expiry': self.fake.credit_card_expire(),
            'city': self.fake.city(),
            'state': self.fake.country(),
            'zipCode': self.fake.postcode(),
            'companyRole': self.fake.job(),
            'companyPhoneNumber': self.fake.phone_number(),
            'planId': 'plan_GoWIYiX2L8hwzx',
            'reference': 'Github'
        }
        return self
    
    def apiRequest(self, url, body, headers):
        response = requests.post(url, body, headers = headers)
        return response.json()
    
    def testApplicationLogKeyIsRequired(self):
        logger = FyipeLogger(self.apiUrl, self.applicationLog['_id'], '')
        response = logger.log('test content');
        self.assertEqual("Application Log Key is required.", response['message'], "Application Log Key Required")
    

if __name__ == '__main__':
    unittest.main()