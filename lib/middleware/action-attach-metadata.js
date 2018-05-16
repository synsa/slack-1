const { SlackWorkspace, SlackUser } = require('../models');

/**
 * Make slackUser and slackWorkspace available
 */
module.exports = async function attachMetaData(req, res, next) {
  const userId = req.body.user.id;
  const teamId = req.body.team.id;

  const slackWorkspace = await SlackWorkspace.findOne({ where: { slackId: teamId } });
  const [slackUser] = await SlackUser.findOrCreate({
    where: { slackId: userId, slackWorkspaceId: slackWorkspace.id },
  });


  // Store metadata in res.locals so it can be used later in the request
  Object.assign(res.locals, {
    slackUser,
    slackWorkspace,
  });

  if (req.body.type === 'interactive_message') {
    Object.assign(res.locals, {
      action: req.body.actions[0].name,
      value: req.body.actions[0].value,
    });
  }

  next();
};