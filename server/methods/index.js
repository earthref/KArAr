import CommonMethods from './common';
import KArArMethods from './karar';
import ElasticSearchMethods from './es';
import S3SearchMethods from './s3';

export default function () {
  CommonMethods();
  KArArMethods();
  ElasticSearchMethods();
  S3SearchMethods();
}