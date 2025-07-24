export function when(condition: () => boolean, fn: () => any) {
  const stop = $effect.root(() => {
    $effect(() => {
      if (condition()) {
        fn();
        stop();
      }
    });
  });
}
