ownsDocument = function(userId, doc) {
	return doc && doc.owner === userId;
}