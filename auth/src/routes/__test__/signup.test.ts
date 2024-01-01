import request from 'supertest';
import { app } from '../../app';


it('returns a 201 on successful signup', async () => {
    const res= await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201);
    expect(res.body.email).toEqual("test@test.com");
    expect(res.body.id).toBeDefined();
}) 

it('returns a 400 with an invalid email', async () => {
    const res= await request(app)
        .post('/api/users/signup')
        .send({
            email: "testtest.com",
            password: "password"
        })
        .expect(400);
    expect(res.body.errors[0].message).toEqual("Email must be valid");
})

it('returns a 400 with an invalid password', async () => {
    const res= await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "p"
        })
        .expect(400);
    expect(res.body.errors[0].message).toEqual("Password must be between 4 and 20 characters");
});

it('returns a 400 with missing email', async () => {
    const response= await request(app)
        .post('/api/users/signup')
        .send({
            password: "password"
        })
        .expect(400);
    expect(response.body.errors[0].message).toEqual("Email must be valid");
})

it('returns a 400 with missing password', async () => {
    const res= await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com"  
        })
        .expect(400);
    expect(res.body.errors[0].message).toEqual("Password must be between 4 and 20 characters");
})

it('returns a 400 with missing email and password', async () => {
    const res= await request(app)
        .post('/api/users/signup')
        .send({})
        .expect(400);
    expect(res.body.errors[0].message).toEqual("Email must be valid");
    expect(res.body.errors[1].message).toEqual("Password must be between 4 and 20 characters");
});

it('disallows duplicate emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201);
   const res= await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "password"
        })
       .expect(409);
    expect(res.body.errors[0].message).toEqual("Email in use");
});

it ('sets a cookie after successful signup', async () => {
    const response =await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201);
    expect(response.get('Set-Cookie')).toBeDefined();
});

