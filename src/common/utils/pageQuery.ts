let async = require("async");

let pageQuery = function(
  page: number,
  pageSize: number,
  Model,
  populate,
  queryParams,
  sortParams,
  callback
) {
  let start = (page - 1) * pageSize;
  let $page: any = {
    pageNumber: page,
  };
  console.log($page);
  async.parallel(
    {
      count: function(done) {
        // 查询数量
        Model.count(queryParams).exec(function(err, count) {
          done(err, count);
        });
      },
      records: function(done) {
        // 查询一页的记录
        Model.find(queryParams)
          .skip(start)
          .limit(pageSize)
          .populate(populate)
          .sort(sortParams)
          .exec(function(err, doc) {
            done(err, doc);
          });
      },
    },
    function(err, results) {
      let count: number = results.count;
      let isEnd = false;
      $page.pageCount = ((count - 1) / pageSize) + 1; // 总共多少页面
      $page.count = count; // 总共多少条
      $page.results = results.records;
      if ($page.pageNumber == $page.pageCount) {
        isEnd = true;
      } else {
        isEnd = false;
      }
      $page.isEnd = isEnd;
      callback(err, $page);
    }
  );
};

export default pageQuery;
