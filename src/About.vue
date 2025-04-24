<script setup></script>

<template>
  <main class="px-2">
    <div class="p-2 sm:p-4 max-w-200 mx-auto">
      <h2>About Upwords</h2>
      <p>
        <a href="https://en.wikipedia.org/wiki/Upwords">Upwords</a> is a word game similar to the
        much better known Scrabble. Unlike Scrabble, you can play tiles
        <span class="font-bold">on top</span> of others, making each game a 3-dimensional patchwork
        of words. Instead of receiving more points for rare letters and bonus squares, scoring is
        based on how high each square is stacked, leading to different strategies than most other
        word games.
      </p>
      <p>
        It's a fun game, I suggest you go check it out! You can find Upwords on the
        <a href="https://apps.apple.com/us/app/upwords-word-stacks/id588252565">App Store</a> or
        <a href="https://play.google.com/store/apps/details?id=com.lonelystarsoftware.upwords&hl=en"
          >Google Play Store</a
        >
        (this is not a paid promotion.)
      </p>
      <h2 class="mt-10">About Upwords Tools</h2>
      <p>
        This project started with the idea of breaking into the highscores in the app, specifically
        to find the highest-scoring single play. This is a similar idea to the supposed best play
        "<a
          href="https://www.reddit.com/r/todayilearned/comments/fpqp3w/til_in_scrabble_the_word_oxyphenbutazone_is/"
          >OXYPHENBUTAZONE</a
        >" (worth 1778 points) in Scrabble. I wanted to figure out what the equivalent would be in
        Upwords.
      </p>
      <p>
        The tool provided here finds all possible plays from any board state. In addition, it allows
        filtering to either avoid or force playing on particular squares. This solver turned out to
        be only a part of finding the solution, albeit an important tool.
      </p>
      <p>
        You can see the code for this web app, along with the libraries that I built for it below on
        GitHub:
      </p>
      <ul class="list-inside">
        <li class="list-disc">
          <a href="https://github.com/PossibilityZero/upwords-toolkit">Upwords Toolkit</a> (Engine)
          <p class="ml-4">A library for playing the Upwords game.</p>
        </li>
        <li class="list-disc">
          <a href="https://github.com/PossibilityZero/upwords-solver">Upwords Solver</a> (Solver)
          <p class="ml-4">
            The "brains" of the app, this is what powers the "plays list" and figures out every
            possible play from a given board state
          </p>
        </li>
        <li class="list-disc">
          <a href="https://github.com/PossibilityZero/upwords-game-player">Upwords Game Player</a>
          (Vue Web App)
          <p class="ml-4">This frontend Vue app which ties together the engine and solver.</p>
        </li>
      </ul>
      <p>
        I'm detailing the development process on <a href="https://possibilityzero.com">my blog</a>,
        if you're interested please have a look there.
      </p>
    </div>
  </main>
</template>

<style scoped>
@import 'tailwindcss';

h2 {
  @apply text-2xl font-bold;
}

p {
  @apply my-3;
}

a {
  @apply underline cursor-pointer text-zinc-400;
}
</style>
