import boto3

def lambda_handler(event, context):
    # Extract the input values from the event
    quiz_number = event['quizNumber']
    quiz_category = event['quizCategory']
    quiz_level = event['quizLevel']
    quiz_expiry = event['quizExpiry']
    time_limit = event['timeLimit']
    quiz_name = event['quizName']
    quiz_description = event['quizDescription']

    # Create a DynamoDB resource
    dynamodb = boto3.resource('dynamodb')

    # Get the Quizzes table
    quizzes_table = dynamodb.Table('Quizzes')

    try:
        # Check if the quiz number already exists
        response = quizzes_table.get_item(
            Key={
                'quizNumber': str(quiz_number)
            }
        )

        if 'Item' in response:
            return {
                'statusCode': 400,
                'body': 'Quiz number already exists'
            }

        # Create the item to be added or updated in the table
        item = {
            'quizNumber': str(quiz_number),
            'quizCategory': quiz_category,
            'quizLevel': quiz_level,
            'timeLimit': time_limit,
            'quizExpiry': quiz_expiry,
            'quizName': quiz_name,
            'quizDescription': quiz_description,
            'quizQuestionNumbers': set('a')  # Initialize an empty string set
        }

        # Put the item into the Quizzes table
        response = quizzes_table.put_item(Item=item)

        # Return a success message
        return {
            'statusCode': 200,
            'body': 'Quiz created successfully'
        }

    except Exception as e:
        # Return a 500 error if an exception occurs
        return {
            'statusCode': 500,
            'body': 'An error occurred: {}'.format(str(e))
        }
