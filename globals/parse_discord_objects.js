module.exports = {
    get_user_name(Member_object) {
        return Member_object.user.username + '#' + Member_object.user.discriminator;
    },
};