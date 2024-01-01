import request from 'supertest';
import { app } from '../../app';

it('fails when a email that does not exist is supplied', async () => {
    const res= await request(app)
        .post('/api/users/signin')
        .send({
            email: "test@test.com",
            password: "password"
        })
        
        .expect(400);
    expect(res.body.errors[0].message).toEqual("Invalid credentials");
});

it("fails when an empty email is supplied", async () => {
    const res= await request(app)
        .post('/api/users/signin')
        .send({
            email: "",
            password: "password"
        })
        .expect(400);
    expect(res.body.errors[0].message).toEqual("Email must be valid");
});

it("fails when an empty password is supplied", async () => {
    const res= await request(app)
        .post('/api/users/signin')
        .send({
            email: "test@test.com",
            password: "",
        })
        .expect(400);
    expect(res.body.errors[0].message).toEqual("You must supply a password");
    
});

it('fails when an incorrect password is supplied', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201);
   const res=  await request(app)
        .post('/api/users/signin')
        .send({
            email: "test@test.com",
            password: "password1"
        })
       .expect(400);
    expect(res.body.errors[0].message).toEqual("Invalid credentials");
});

it('responds with a cookie when given valid credentials', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201);
    const response=await request(app)
        .post('/api/users/signin')
        .send({
            email: "test@test.com",
            password: "password"
        }).expect(200);
    expect(response.get('Set-Cookie')).toBeDefined();
    expect(response.body.email).toEqual("test@test.com");
    expect(response.body.id).toBeDefined();
});


