/*
 * @note 常用函数
 * @author early
 * @version 0.0.1
 * @date NaN
 * @warning 将被废弃
 */

var H = B.H = {

    /** method ~ H
     * @name isLogin
     * @author yujiajie
     * @note 判断是否登陆
     * @method static
     * @example H.isLogin()
     * @return {boolean} 登陆状态
     * @return-val true : 已登陆
     * @return-val false : 未登陆
     */
    isLogin : function() {

        if ( $.cookie('st_au') !== null ) {
            return true;
        } else {
            return false;
        }

    },

    /** method ~ H
     * @name lastLoginId
     * @author yujiajie
     * @note 获取最后登陆的用户id
     * @method static
     * @example H.lastLoginId()
     * @return {number} 用户id
     */
    lastLoginId : function() {

        return $.cookie('_last_login_id_');

    }
    
};