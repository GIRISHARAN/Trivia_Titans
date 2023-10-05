import boto3

def lambda_handler(event, context):
    # Extract the input values from the event
    quiz_number = event['quizNumber']
    quiz_category = event.get('quizCategory')
    quiz_level = event.get('quizLevel')
    time_limit = event.get('timeLimit')
    quiz_expiry = event.get('quizExpiry')
    quiz_description = event.get('quizDescription')
    quiz_name = event.get('quizName')

    # Create a DynamoDB resource
    dynamodb = boto3.resource('dynamodb')

    try:
        # Get the Quizzes table
        quizzes_table = dynamodb.Table('Quizzes')

        # Retrieve the existing quiz item from the table
        response = quizzes_table.get_item(
            Key={
                'quizNumber': quiz_number
            }
        )

        if 'Item' not in response:
            return {
                'statusCode': 404,
                'body': 'Quiz not found'
            }

        # Update the fields if provided in the event
        item = response['Item']
        if quiz_category:
            item['quizCategory'] = quiz_category
        if quiz_level:
            item['quizLevel'] = quiz_level
        if time_limit:
            item['timeLimit'] = time_limit
        if quiz_expiry:
            item['quizExpiry'] = quiz_expiry
        if quiz_name:
            item['quizName'] = quiz_name
        if quiz_description:
            item['quizDescription'] = quiz_description

        # Update the item in the Quizzes table
        quizzes_table.put_item(Item=item)

        # Return a success message
        return {
            'statusCode': 200,
            'body': 'Quiz updated successfully'
        }

    except Exception as e:
        # Return a 500 error if an exception occurs
        return {
            'statusCode': 500,
            'body': 'An error occurred: {}'.format(str(e))
        }
