## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Start the development server:
   ```bash
   bun run dev
   ```
4. Open http://localhost:3000 in your browser

## Notes

My intial idea with this project was to use standard HTTP requests, but after thinking about it for a while, I noticed how often you mentioned "robust connection" and durability in the instructions.

So, I went with websockets instead as they're the defacto standard for these use cases.
For the frontend I used just tailwind and lucide. The fonts and colors I got off the planchecksolver.com website so it would fit the aesthetic of the rest of the website.
I liked having a progress bar, but I also liked having a grid underneath so you can watch them real time and see which ones are doing good / bad, so I went with both. 
There is also some automatic reconnect logic in the frontend.
I should also mention I use bun for my runtime (very happy with it so far), and recently updated to the bun 1.2 which came out a week ago, so you might need to run `bun upgrade` to get the latest version.

For the backend, I used the websockets integration with fastapi, which specifically was new to me, but there's extensive documentation / and claude is your friend. I also swapped to using UV instead of pip to manage the dependencies, it's much faster and more modern, but a bit to wrap your head around.  
It's really just one big function that handles the connection, waits, and sends back updates.
I added a 5% failure rate in the backend so you can visually see the processes fail in the frontend.

The logical next step would be some sort of individual retry mechanism for any failed processes, I'd probably have to make some sort of new route in the backend for that (because right now it just does everything all in one shot).

And then if you wanted to start storing the data, probably some quick and dirty sqlite database would be enough.



