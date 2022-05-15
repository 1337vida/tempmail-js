<div id="top"></div>

# tempmail-js
⚡️ Free, open-source and easy to setup tempmail written in Node.JS!

tempmail.js uses [MongoDB](https://mongodb.com/) to store it's data. 

## Installation
Installing tempmail.js is very easy, all you have to do is:
1. Clone the repository
```sh
git clone https://github.com/1337vida/tempmail-js.git
```
2. Install required NPM packages
```sh
npm install
```
3. Customize your `config.json`
4. Run the script!
```sh
npm start
```
<p align="right">(<a href="#top">back to top</a>)</p>

## API Information
All requests need to be authorized via `Authorization` header which contains the api key from `config.json`

Method for all the requests is `GET`

<p align="right">(<a href="#top">back to top</a>)</p>

## API Routes
Here are all the available routes for tempmail.js:

- `/api/domains`
- `/api/:inbox`
- `/api/:inbox/list`
- `/api/:inbox/latest`
- `/api/:inbox/:emailId`

<p align="right">(<a href="#top">back to top</a>)</p>

## Roadmap
- [ ] Add real-time notification system, maybe based on socket.io?
- [ ] Add a webhook notifier on new email

<p align="right">(<a href="#top">back to top</a>)</p>

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>
