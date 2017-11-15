/**
 * Created by Administrator on 2017/10/17.
 */
import Mock from 'mockjs';
Mock.mock('/msg', {
  'username': '@name',
  'role|1-3': 1,
  'password': 'password'
});
