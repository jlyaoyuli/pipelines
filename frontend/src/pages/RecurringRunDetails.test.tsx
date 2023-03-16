/*
 * Copyright 2018 The Kubeflow Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from 'react';
import RecurringRunDetails from './RecurringRunDetails';
import TestUtils from 'src/TestUtils';
import { V2beta1RecurringRun, V2beta1RecurringRunStatus } from 'src/apisv2beta1/recurringrun';
import { Apis } from 'src/lib/Apis';
import { PageProps } from './Page';
import { RouteParams, RoutePage, QUERY_PARAMS } from 'src/components/Router';
import { shallow, ReactWrapper, ShallowWrapper } from 'enzyme';
import { ButtonKeys } from 'src/lib/Buttons';

describe('RecurringRunDetails', () => {
  let tree: ReactWrapper<any> | ShallowWrapper<any>;

  const updateBannerSpy = jest.fn();
  const updateDialogSpy = jest.fn();
  const updateSnackbarSpy = jest.fn();
  const updateToolbarSpy = jest.fn();
  const historyPushSpy = jest.fn();
  const getRecurringRunSpy = jest.spyOn(Apis.recurringRunServiceApi, 'getRecurringRun');
  const deleteRecurringRunSpy = jest.spyOn(Apis.recurringRunServiceApi, 'deleteRecurringRun');
  const enableRecurringRunSpy = jest.spyOn(Apis.recurringRunServiceApi, 'enableRecurringRun');
  const disableRecurringRunSpy = jest.spyOn(Apis.recurringRunServiceApi, 'disableRecurringRun');
  const getExperimentSpy = jest.spyOn(Apis.experimentServiceApi, 'getExperiment');

  let fullTestRecurringRun: V2beta1RecurringRun = {};

  function generateProps(): PageProps {
    const match = {
      isExact: true,
      params: { [RouteParams.recurringRunId]: fullTestRecurringRun.recurring_run_id },
      path: '',
      url: '',
    };
    return TestUtils.generatePageProps(
      RecurringRunDetails,
      '' as any,
      match,
      historyPushSpy,
      updateBannerSpy,
      updateDialogSpy,
      updateToolbarSpy,
      updateSnackbarSpy,
    );
  }

  beforeEach(() => {
    fullTestRecurringRun = {
      created_at: new Date(2018, 8, 5, 4, 3, 2),
      description: 'test recurring run description',
      display_name: 'test recurring run',
      max_concurrency: '50',
      no_catchup: true,
      pipeline_spec: {
        // parameters: [{ name: 'param1', value: 'value1' }],
        pipeline_id: 'some-pipeline-id',
      },
      recurring_run_id: 'test-recurring-run-id',
      runtime_config: { parameters: { param1: 'value1' } },
      status: V2beta1RecurringRunStatus.ENABLED,
      trigger: {
        periodic_schedule: {
          end_time: new Date(2018, 10, 9, 8, 7, 6),
          interval_second: '3600',
          start_time: new Date(2018, 9, 8, 7, 6),
        },
      },
    } as V2beta1RecurringRun;

    jest.clearAllMocks();
    getRecurringRunSpy.mockImplementation(() => fullTestRecurringRun);
    deleteRecurringRunSpy.mockImplementation();
    enableRecurringRunSpy.mockImplementation();
    disableRecurringRunSpy.mockImplementation();
    getExperimentSpy.mockImplementation();
  });

  afterEach(() => tree.unmount());

  it('renders a recurring run with periodic schedule', async () => {
    tree = shallow(<RecurringRunDetails {...generateProps()} />);
    await TestUtils.flushPromises();
    expect(tree).toMatchSnapshot();
  });

  it('renders a recurring run with cron schedule', async () => {
    const cronTestRecurringRun = {
      ...fullTestRecurringRun,
      no_catchup: undefined, // in api requests, it's undefined when false
      trigger: {
        cron_schedule: {
          cron: '* * * 0 0 !',
          end_time: new Date(2018, 10, 9, 8, 7, 6),
          start_time: new Date(2018, 9, 8, 7, 6),
        },
      },
    };
    getRecurringRunSpy.mockImplementation(() => cronTestRecurringRun);
    tree = shallow(<RecurringRunDetails {...generateProps()} />);
    await TestUtils.flushPromises();
    expect(tree).toMatchSnapshot();
  });

  it('loads the recurring run given its id in query params', async () => {
    // The run id is in the router match object, defined inside generateProps
    tree = shallow(<RecurringRunDetails {...generateProps()} />);
    await TestUtils.flushPromises();
    expect(getRecurringRunSpy).toHaveBeenLastCalledWith(fullTestRecurringRun.recurring_run_id);
    expect(getExperimentSpy).not.toHaveBeenCalled();
  });

  it('shows All runs -> run name when there is no experiment', async () => {
    // The run id is in the router match object, defined inside generateProps
    tree = shallow(<RecurringRunDetails {...generateProps()} />);
    await TestUtils.flushPromises();
    expect(updateToolbarSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        breadcrumbs: [{ displayName: 'All runs', href: RoutePage.RUNS }],
        pageTitle: fullTestRecurringRun.display_name,
      }),
    );
  });

  it('loads the recurring run and its experiment if it has one', async () => {
    fullTestRecurringRun.experiment_id = 'test-experiment-id';
    tree = shallow(<RecurringRunDetails {...generateProps()} />);
    await TestUtils.flushPromises();
    expect(getRecurringRunSpy).toHaveBeenLastCalledWith(fullTestRecurringRun.recurring_run_id);
    expect(getExperimentSpy).toHaveBeenLastCalledWith('test-experiment-id');
  });

  it('shows Experiments -> Experiment name -> run name when there is an experiment', async () => {
    fullTestRecurringRun.experiment_id = 'test-experiment-id';
    getExperimentSpy.mockImplementation(id => ({ id, name: 'test experiment name' }));
    tree = shallow(<RecurringRunDetails {...generateProps()} />);
    await TestUtils.flushPromises();
    expect(updateToolbarSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        breadcrumbs: [
          { displayName: 'Experiments', href: RoutePage.EXPERIMENTS },
          {
            displayName: 'test experiment name',
            href: RoutePage.EXPERIMENT_DETAILS.replace(
              ':' + RouteParams.experimentId,
              'test-experiment-id',
            ),
          },
        ],
        pageTitle: fullTestRecurringRun.display_name,
      }),
    );
  });

  it('shows error banner if run cannot be fetched', async () => {
    TestUtils.makeErrorResponseOnce(getRecurringRunSpy, 'woops!');
    tree = shallow(<RecurringRunDetails {...generateProps()} />);
    await TestUtils.flushPromises();
    expect(updateBannerSpy).toHaveBeenCalledTimes(2); // Once to clear, once to show error
    expect(updateBannerSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        additionalInfo: 'woops!',
        message: `Error: failed to retrieve recurring run: ${fullTestRecurringRun.recurring_run_id}. Click Details for more information.`,
        mode: 'error',
      }),
    );
  });

  it('shows warning banner if has experiment but experiment cannot be fetched. still loads run', async () => {
    fullTestRecurringRun.experiment_id = 'test-experiment-id';
    TestUtils.makeErrorResponseOnce(getExperimentSpy, 'woops!');
    tree = shallow(<RecurringRunDetails {...generateProps()} />);
    await TestUtils.flushPromises();
    expect(updateBannerSpy).toHaveBeenCalledTimes(2); // Once to clear, once to show error
    expect(updateBannerSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        additionalInfo: 'woops!',
        message: `Error: failed to retrieve this recurring run's experiment. Click Details for more information.`,
        mode: 'warning',
      }),
    );
    expect(tree.state('run')).toEqual(fullTestRecurringRun);
  });

  it('has a Refresh button, clicking it refreshes the run details', async () => {
    tree = shallow(<RecurringRunDetails {...generateProps()} />);
    const instance = tree.instance() as RecurringRunDetails;
    const refreshBtn = instance.getInitialToolbarState().actions[ButtonKeys.REFRESH];
    expect(refreshBtn).toBeDefined();
    expect(getRecurringRunSpy).toHaveBeenCalledTimes(1);
    await refreshBtn!.action();
    expect(getRecurringRunSpy).toHaveBeenCalledTimes(2);
  });

  it('has a clone button, clicking it navigates to new run page', async () => {
    tree = shallow(<RecurringRunDetails {...generateProps()} />);
    await TestUtils.flushPromises();
    const instance = tree.instance() as RecurringRunDetails;
    const cloneBtn = instance.getInitialToolbarState().actions[ButtonKeys.CLONE_RECURRING_RUN];
    expect(cloneBtn).toBeDefined();
    await cloneBtn!.action();
    expect(historyPushSpy).toHaveBeenCalledTimes(1);
    expect(historyPushSpy).toHaveBeenLastCalledWith(
      RoutePage.NEW_RUN +
        `?${QUERY_PARAMS.cloneFromRecurringRun}=${fullTestRecurringRun!.recurring_run_id}` +
        `&${QUERY_PARAMS.isRecurring}=1`,
    );
  });

  it('shows enabled Disable, and disabled Enable buttons if the run is enabled', async () => {
    tree = shallow(<RecurringRunDetails {...generateProps()} />);
    await TestUtils.flushPromises();
    expect(updateToolbarSpy).toHaveBeenCalledTimes(2);
    const enableBtn = TestUtils.getToolbarButton(updateToolbarSpy, ButtonKeys.ENABLE_RECURRING_RUN);
    expect(enableBtn).toBeDefined();
    expect(enableBtn!.disabled).toBe(true);
    const disableBtn = TestUtils.getToolbarButton(
      updateToolbarSpy,
      ButtonKeys.DISABLE_RECURRING_RUN,
    );
    expect(disableBtn).toBeDefined();
    expect(disableBtn!.disabled).toBe(false);
  });

  it('shows enabled Disable, and disabled Enable buttons if the run is disabled', async () => {
    fullTestRecurringRun.status = V2beta1RecurringRunStatus.DISABLED;
    tree = shallow(<RecurringRunDetails {...generateProps()} />);
    await TestUtils.flushPromises();
    expect(updateToolbarSpy).toHaveBeenCalledTimes(2);
    const enableBtn = TestUtils.getToolbarButton(updateToolbarSpy, ButtonKeys.ENABLE_RECURRING_RUN);
    expect(enableBtn).toBeDefined();
    expect(enableBtn!.disabled).toBe(false);
    const disableBtn = TestUtils.getToolbarButton(
      updateToolbarSpy,
      ButtonKeys.DISABLE_RECURRING_RUN,
    );
    expect(disableBtn).toBeDefined();
    expect(disableBtn!.disabled).toBe(true);
  });

  it('shows enabled Disable, and disabled Enable buttons if the run is undefined', async () => {
    fullTestRecurringRun.status = undefined;
    tree = shallow(<RecurringRunDetails {...generateProps()} />);
    await TestUtils.flushPromises();
    expect(updateToolbarSpy).toHaveBeenCalledTimes(2);
    const enableBtn = TestUtils.getToolbarButton(updateToolbarSpy, ButtonKeys.ENABLE_RECURRING_RUN);
    expect(enableBtn).toBeDefined();
    expect(enableBtn!.disabled).toBe(false);
    const disableBtn = TestUtils.getToolbarButton(
      updateToolbarSpy,
      ButtonKeys.DISABLE_RECURRING_RUN,
    );
    expect(disableBtn).toBeDefined();
    expect(disableBtn!.disabled).toBe(true);
  });

  it('calls disable API when disable button is clicked, refreshes the page', async () => {
    tree = shallow(<RecurringRunDetails {...generateProps()} />);
    await TestUtils.flushPromises();
    const instance = tree.instance() as RecurringRunDetails;
    const disableBtn = instance.getInitialToolbarState().actions[ButtonKeys.DISABLE_RECURRING_RUN];
    await disableBtn!.action();
    expect(disableRecurringRunSpy).toHaveBeenCalledTimes(1);
    expect(disableRecurringRunSpy).toHaveBeenLastCalledWith('test-recurring-run-id');
    expect(getRecurringRunSpy).toHaveBeenCalledTimes(2);
    expect(getRecurringRunSpy).toHaveBeenLastCalledWith('test-recurring-run-id');
  });

  it('shows error dialog if disable fails', async () => {
    tree = shallow(<RecurringRunDetails {...generateProps()} />);
    TestUtils.makeErrorResponseOnce(disableRecurringRunSpy, 'could not disable');
    await TestUtils.flushPromises();
    const instance = tree.instance() as RecurringRunDetails;
    const disableBtn = instance.getInitialToolbarState().actions[ButtonKeys.DISABLE_RECURRING_RUN];
    await disableBtn!.action();
    expect(updateDialogSpy).toHaveBeenCalledTimes(1);
    expect(updateDialogSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        content: 'could not disable',
        title: 'Failed to disable recurring run',
      }),
    );
  });

  it('shows error dialog if enable fails', async () => {
    fullTestRecurringRun.status = V2beta1RecurringRunStatus.DISABLED;
    tree = shallow(<RecurringRunDetails {...generateProps()} />);
    TestUtils.makeErrorResponseOnce(enableRecurringRunSpy, 'could not enable');
    await TestUtils.flushPromises();
    const instance = tree.instance() as RecurringRunDetails;
    const enableBtn = instance.getInitialToolbarState().actions[ButtonKeys.ENABLE_RECURRING_RUN];
    await enableBtn!.action();
    expect(updateDialogSpy).toHaveBeenCalledTimes(1);
    expect(updateDialogSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        content: 'could not enable',
        title: 'Failed to enable recurring run',
      }),
    );
  });

  it('calls enable API when enable button is clicked, refreshes the page', async () => {
    fullTestRecurringRun.status = V2beta1RecurringRunStatus.DISABLED;
    tree = shallow(<RecurringRunDetails {...generateProps()} />);
    await TestUtils.flushPromises();
    const instance = tree.instance() as RecurringRunDetails;
    const enableBtn = instance.getInitialToolbarState().actions[ButtonKeys.ENABLE_RECURRING_RUN];
    await enableBtn!.action();
    expect(enableRecurringRunSpy).toHaveBeenCalledTimes(1);
    expect(enableRecurringRunSpy).toHaveBeenLastCalledWith('test-recurring-run-id');
    expect(getRecurringRunSpy).toHaveBeenCalledTimes(2);
    expect(getRecurringRunSpy).toHaveBeenLastCalledWith('test-recurring-run-id');
  });

  it('shows a delete button', async () => {
    tree = shallow(<RecurringRunDetails {...generateProps()} />);
    await TestUtils.flushPromises();
    const instance = tree.instance() as RecurringRunDetails;
    const deleteBtn = instance.getInitialToolbarState().actions[ButtonKeys.DELETE_RUN];
    expect(deleteBtn).toBeDefined();
  });

  it('shows delete dialog when delete button is clicked', async () => {
    tree = shallow(<RecurringRunDetails {...generateProps()} />);
    await TestUtils.flushPromises();
    const instance = tree.instance() as RecurringRunDetails;
    const deleteBtn = instance.getInitialToolbarState().actions[ButtonKeys.DELETE_RUN];
    await deleteBtn!.action();
    expect(updateDialogSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        title: 'Delete this recurring run config?',
      }),
    );
  });

  it('calls delete API when delete confirmation dialog button is clicked', async () => {
    tree = shallow(<RecurringRunDetails {...generateProps()} />);
    await TestUtils.flushPromises();
    const instance = tree.instance() as RecurringRunDetails;
    const deleteBtn = instance.getInitialToolbarState().actions[ButtonKeys.DELETE_RUN];
    await deleteBtn!.action();
    const call = updateDialogSpy.mock.calls[0][0];
    const confirmBtn = call.buttons.find((b: any) => b.text === 'Delete');
    await confirmBtn.onClick();
    expect(deleteRecurringRunSpy).toHaveBeenCalledTimes(1);
    expect(deleteRecurringRunSpy).toHaveBeenLastCalledWith('test-recurring-run-id');
  });

  it('does not call delete API when delete cancel dialog button is clicked', async () => {
    tree = shallow(<RecurringRunDetails {...generateProps()} />);
    await TestUtils.flushPromises();
    const instance = tree.instance() as RecurringRunDetails;
    const deleteBtn = instance.getInitialToolbarState().actions[ButtonKeys.DELETE_RUN];
    await deleteBtn!.action();
    const call = updateDialogSpy.mock.calls[0][0];
    const confirmBtn = call.buttons.find((b: any) => b.text === 'Cancel');
    await confirmBtn.onClick();
    expect(deleteRecurringRunSpy).not.toHaveBeenCalled();
    // Should not reroute
    expect(historyPushSpy).not.toHaveBeenCalled();
  });

  // TODO: need to test the dismiss path too--when the dialog is dismissed using ESC
  // or clicking outside it, it should be treated the same way as clicking Cancel.

  it('redirects back to parent experiment after delete', async () => {
    tree = shallow(<RecurringRunDetails {...generateProps()} />);
    await TestUtils.flushPromises();
    const deleteBtn = (tree.instance() as RecurringRunDetails).getInitialToolbarState().actions[
      ButtonKeys.DELETE_RUN
    ];
    await deleteBtn!.action();
    const call = updateDialogSpy.mock.calls[0][0];
    const confirmBtn = call.buttons.find((b: any) => b.text === 'Delete');
    await confirmBtn.onClick();
    expect(deleteRecurringRunSpy).toHaveBeenLastCalledWith('test-recurring-run-id');
    expect(historyPushSpy).toHaveBeenCalledTimes(1);
    expect(historyPushSpy).toHaveBeenLastCalledWith(RoutePage.EXPERIMENTS);
  });

  it('shows snackbar after successful deletion', async () => {
    tree = shallow(<RecurringRunDetails {...generateProps()} />);
    await TestUtils.flushPromises();
    const deleteBtn = (tree.instance() as RecurringRunDetails).getInitialToolbarState().actions[
      ButtonKeys.DELETE_RUN
    ];
    await deleteBtn!.action();
    const call = updateDialogSpy.mock.calls[0][0];
    const confirmBtn = call.buttons.find((b: any) => b.text === 'Delete');
    await confirmBtn.onClick();
    expect(updateSnackbarSpy).toHaveBeenCalledTimes(1);
    expect(updateSnackbarSpy).toHaveBeenLastCalledWith({
      message: 'Delete succeeded for this recurring run config',
      open: true,
    });
  });

  it('shows error dialog after failing deletion', async () => {
    TestUtils.makeErrorResponseOnce(deleteRecurringRunSpy, 'could not delete');
    tree = shallow(<RecurringRunDetails {...generateProps()} />);
    await TestUtils.flushPromises();
    const deleteBtn = (tree.instance() as RecurringRunDetails).getInitialToolbarState().actions[
      ButtonKeys.DELETE_RUN
    ];
    await deleteBtn!.action();
    const call = updateDialogSpy.mock.calls[0][0];
    const confirmBtn = call.buttons.find((b: any) => b.text === 'Delete');
    await confirmBtn.onClick();
    await TestUtils.flushPromises();
    expect(updateDialogSpy).toHaveBeenCalledTimes(2);
    expect(updateDialogSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        content:
          'Failed to delete recurring run config: test-recurring-run-id with error: "could not delete"',
        title: 'Failed to delete recurring run config',
      }),
    );
    // Should not reroute
    expect(historyPushSpy).not.toHaveBeenCalled();
  });
});
