import Base from '@/models/Base'
import gql from 'graphql-tag'

class CombinatorQuery extends Base {
  static indexKey = 'combinatorQueries'

  static resourcePath = 'combinator-queries'

  static actions = []

  static fillable = []

  static public = []

}

export default CombinatorQuery