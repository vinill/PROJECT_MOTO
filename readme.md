

E-shop project with user login/registration and adding products to cart.

To run this project you need to install elasticsearch.

Guide:https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-elasticsearch-on-ubuntu-16-04

Then  run:
    `$ sudo service elasticsearch start`
    

Run  Node.js Server

    $ npm install -g nodemon
    $ npm install 
    $ nodemon server.js

Default user login:

`Login: user@email.com`
`Password: 123`

If you have error while starting the server(error: No Living connections
)  simple restart elasticsearch service or reload terminal

    $ sudo service elasticsearch stop
    $ sudo service elasticsearch start
