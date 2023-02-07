class APIfeatures {

  constructor(query, queryString) {
    this.query = query
    this.queryString = queryString
  }

  filter(filter) {
    const queryObject = { ...this.queryString }

    // filtering 
    const excludedParams = ["page", "sort", "limit", "fields"]
    excludedParams.forEach(val => delete queryObject[val])

    // advanced filtering 
    let queryStr = JSON.stringify(queryObject)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

    if (Object.keys(filter).length !== 0) {
      this.query.find(filter)
    }
    this.query.find(JSON.parse(queryStr))
    return this
  }

  sort() {
    // sorting
    if (this.queryString.sort) {
      const sortsBy = this.queryString.sort.split(',').join(' ')
      this.query = this.query.sort(sortsBy)
    }
    return this
  }

  fields() {
    // fields
    if (this.queryString.fields) {
      const fieldsBy = this.queryString.fields.split(',').join(' ')
      this.query = this.query.select(fieldsBy)
    }
    else {
      this.query = this.query.select('-__v')
    }
    return this
  }

  pagination() {
    // pagination 
    const page = this.queryString.page * 1 || 1
    const limit = this.queryString.limit * 1 || 100
    const skip = (page - 1) * limit
    this.query = this.query.skip(skip).limit(limit)
    return this
  }
  
}

module.exports = APIfeatures