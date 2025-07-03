const AWS = require('aws-sdk');
const sns = new AWS.SNS();

// When an order is placed
app.post('/api/orders', async (req, res) => {
    try {
        // Save order to DynamoDB
        const orderParams = {
            TableName: 'Orders',
            Item: {
                orderId: generateOrderId(),
                userId: req.user.userId,
                items: req.body.items,
                total: req.body.total,
                shippingAddress: req.body.shippingAddress,
                status: 'processing',
                createdAt: new Date().toISOString()
            }
        };
        
        await dynamodb.put(orderParams).promise();
        
        // Get user details
        const userParams = {
            TableName: 'Users',
            Key: {
                userId: req.user.userId
            }
        };
        
        const userData = await dynamodb.get(userParams).promise();
        
        // Send SMS confirmation
        const smsParams = {
            Message: `Your SpiceJar order #${orderParams.Item.orderId} has been received. Total: $${orderParams.Item.total}`,
            PhoneNumber: userData.Item.phone
        };
        
        await sns.publish(smsParams).promise();
        
        res.status(201).json({ 
            success: true,
            orderId: orderParams.Item.orderId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to place order' });
    }
});