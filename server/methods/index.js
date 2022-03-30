import CommonMethods from './common';
import KARARMethods from './karar';
import ElasticSearchMethods from './es';
import S3SearchMethods from './s3';

export default function () {
  CommonMethods();
  KARARMethods();
  ElasticSearchMethods();
  S3SearchMethods();
}