# coding: utf-8

"""
    Kubeflow Pipelines API

    This file contains REST API specification for Kubeflow Pipelines. The file is autogenerated from the swagger definition.

    Contact: kubeflow-pipelines@google.com
    Generated by: https://openapi-generator.tech
"""


from __future__ import absolute_import

import unittest
import datetime

import kfp_server_api
from kfp_server_api.models.v2beta1_recurring_run import V2beta1RecurringRun  # noqa: E501
from kfp_server_api.rest import ApiException

class TestV2beta1RecurringRun(unittest.TestCase):
    """V2beta1RecurringRun unit test stubs"""

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def make_instance(self, include_optional):
        """Test V2beta1RecurringRun
            include_option is a boolean, when False only required
            params are included, when True both required and
            optional params are included """
        # model = kfp_server_api.models.v2beta1_recurring_run.V2beta1RecurringRun()  # noqa: E501
        if include_optional :
            return V2beta1RecurringRun(
                recurring_run_id = '0', 
                display_name = '0', 
                description = '0', 
                pipeline_id = '0', 
                pipeline_spec = kfp_server_api.models.pipeline_spec.pipeline_spec(), 
                runtime_config = kfp_server_api.models.v2beta1_runtime_config.v2beta1RuntimeConfig(
                    parameters = {
                        'key' : None
                        }, 
                    pipeline_root = '0', ), 
                service_account = '0', 
                max_concurrency = '0', 
                trigger = kfp_server_api.models.v2beta1_trigger.v2beta1Trigger(
                    cron_schedule = kfp_server_api.models.v2beta1_cron_schedule.v2beta1CronSchedule(
                        start_time = datetime.datetime.strptime('2013-10-20 19:20:30.00', '%Y-%m-%d %H:%M:%S.%f'), 
                        end_time = datetime.datetime.strptime('2013-10-20 19:20:30.00', '%Y-%m-%d %H:%M:%S.%f'), 
                        cron = '0', ), 
                    periodic_schedule = kfp_server_api.models.v2beta1_periodic_schedule.v2beta1PeriodicSchedule(
                        start_time = datetime.datetime.strptime('2013-10-20 19:20:30.00', '%Y-%m-%d %H:%M:%S.%f'), 
                        end_time = datetime.datetime.strptime('2013-10-20 19:20:30.00', '%Y-%m-%d %H:%M:%S.%f'), 
                        interval_second = '0', ), ), 
                mode = 'MODE_UNSPECIFIED', 
                created_at = datetime.datetime.strptime('2013-10-20 19:20:30.00', '%Y-%m-%d %H:%M:%S.%f'), 
                updated_at = datetime.datetime.strptime('2013-10-20 19:20:30.00', '%Y-%m-%d %H:%M:%S.%f'), 
                status = 'STATUS_UNSPECIFIED', 
                error = '0', 
                no_catchup = True, 
                namespace = '0', 
                experiment_id = '0'
            )
        else :
            return V2beta1RecurringRun(
        )

    def testV2beta1RecurringRun(self):
        """Test V2beta1RecurringRun"""
        inst_req_only = self.make_instance(include_optional=False)
        inst_req_and_optional = self.make_instance(include_optional=True)


if __name__ == '__main__':
    unittest.main()
