###
temp

after 
```docker-compose up -d```

enter mongo shell and add

```use Users```
```
db.createUser(
{
    user: "sammy",
    pwd: "123456",
    roles: [
      { role: "readWrite", db: "Users" }
    ]
})
```