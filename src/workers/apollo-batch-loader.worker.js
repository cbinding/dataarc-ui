const batches = []
const runningBatches = []
const concurrentJobs = 5
const featureStep = 100

export default async (apollo, dataKey, start, stop) => {
  let startIterator = start
  console.log({
    dataKey, start, stop, startIterator,
  })
  while (startIterator < stop) {
    startIterator += featureStep
    batches.push(
      {
        start: startIterator,
        limit: 100,
      },
    )
  }

  while (batches.length > 0) {
    if (runningBatches.length <= concurrentJobs) {
      const variables = batches.pop()
      runningBatches.push(variables)
      apollo.queries[dataKey].fetchMore({
        variables,
        updateQuery: (previousResult, { fetchMoreResult }) => {
          runningBatches.pop()
          console.log(runningBatches.length)
          return {
            features: [...previousResult[dataKey], ...fetchMoreResult[dataKey]],
          }
        },
      })
    }
  }
}
