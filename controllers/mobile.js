/**
 * GET /mobile
 */
exports.mobile = function(req, res) {
  res.render('mobile', {
    title: 'Mobile'
  });
};
