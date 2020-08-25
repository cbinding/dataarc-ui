import Base from '@/models/Base'
import gql from 'graphql-tag'

class Concept extends Base {
  static indexKey = 'concepts'

  static resourcePath = 'concepts'

  static actions = []

  static fillable = []

  static public = []

}

export default Concept