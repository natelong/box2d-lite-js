# Box2d-lite-js
Just a simple drop-in physics library for doing basic animation stuff in the browser. More a proof-of-concept than anything else, this library is unoptimized and slow. But it works and was ported by hand from the original [C++ code](http://code.google.com/p/box2d/downloads/detail?name=Box2D_Lite.zip) by Erin Catto.

I was trying my hand and making browser-based games, and I found that the main [JS physics library](http://box2d-js.sourceforge.net/) everyone was using was pretty bloated and unwieldy. For instance, it required that you reference a bunch of different files (yeah, you can combine them yourself, but why?) and polluted the global namespace pretty fiercely. In its defense, Box2d JS was automatically ported from ActionScript, so it's doing a good job with what it has. I wanted something better, so naturally I assumed I could do it myself.

Obviously, physics engines are difficult to build, and my little attempt was hard-fought, but somewhat successful. If you check out the only demo included with the source, you'll see that this library only covers boxes, and with some... quirks.

I plan to update the source to clean it up and document the code more, then tackle some of the bugs and low-hanging fruit in the efficiency department. My goal is to end up with a usable physics library with a small footprint.

**Thanks for taking the time to check this out!**