export function mapCombiner(list: {
  mapStateToProps: unknown;
  mapDispatchProps: unknown;
}[]): unknown {
  const objectMap = {};

  for (const item of list) {
    const { mapStateToProps, mapDispatchProps } = item;

    for (const [key, value] of Object.entries(mapStateToProps)) {
      Object.defineProperty(objectMap, key, { value });
    }

    for (const [key, value] of Object.entries(mapDispatchProps)) {
      Object.defineProperty(objectMap, key, { value });
    }
  }

  return objectMap;
}
