export function filterRootInputs(
  inputs: { id: string; label: string; code?: string }[]
) {
  return inputs.filter(
    (input) =>
      !input.id.includes("::") &&
      !(input.code && /<Form\.Item[^>]*hidden/.test(input.code))
  );
}
