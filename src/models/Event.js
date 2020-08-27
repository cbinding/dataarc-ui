import Base from '@/models/Base'
import gql from 'graphql-tag'

class Event extends Base {
  static indexKey = 'events'

  static resourcePath = 'events'

  static actions = []

  static fillable = []

  static public = []

}

export default Event