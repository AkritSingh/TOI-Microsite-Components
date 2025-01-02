import _get from 'lodash.get';

// {
//     type: 'ad',
//     config: {
//       layoutType: 'mrec',
//       name: 'mrec3',
//       position: {
//         repeat: true,
//         interval: 1,
//         value: 4,
//       },
//     },
//   },

// so looking above ex, we want next adObj should be at 5th pos , 6th Pos so on, till insertsLimit

const resolveRepeatedInserts = (insertObj, insertsLimit) => {
  const newInserts = [];
  if (insertObj) {
    const { config = {} } = insertObj;
    const { rendering } = config;
    const { insert } = rendering;
    const { interval, position } = insert;
    let initalPos = position + interval; // starting with next repeated item, as one item is already present at this pos
    let newConfig = {};
    // const newInsert = { ...insert, config: null };

    while (initalPos <= insertsLimit) {
      newConfig = {
        ...config,
        rendering: {
          insert: {
            type: insert.type,
            position: initalPos,
          },
        },
        uniqueid: initalPos,
      }; // updating config with newPos
      newInserts.push({ ...insertObj, config: newConfig });
      initalPos += interval;
    }
  }
  return newInserts;
};

const getResolvedInsert = (insertsLimit, inserts = []) => {
  //   const repeatedInsertsIndexes = [];
  const repeatedInsertsArr = [];
  let resolvedInserts = [];
  let isRepeatedInsert;
  //   let modifiedInserts;

  if (Array.isArray(inserts) && inserts.length > 0) {
    const insertsLength = inserts.length;
    // modifiedInserts = [...inserts];
    let insert;

    for (let i = 0; i < insertsLength; i += 1) {
      insert = inserts[i];
      isRepeatedInsert = _get(insert, 'config.rendering.insert.repeat');
      if (isRepeatedInsert) {
        // repeatedInsertsIndexes.push(i);
        repeatedInsertsArr.push(insert);
      }
    }
    // repeated insert logic
    if (repeatedInsertsArr.length > 0) {
      for (let i = 0; i <= repeatedInsertsArr.length; i += 1) {
        resolvedInserts = [
          ...resolvedInserts,
          ...resolveRepeatedInserts(repeatedInsertsArr[i], insertsLimit),
        ];
      }
    }
  }
  const finalInserts = [...inserts, ...resolvedInserts];
  return finalInserts;
};

export default getResolvedInsert;
