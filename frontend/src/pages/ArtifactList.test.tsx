/*
 * Copyright 2021 The Kubeflow Authors
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

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Api } from 'src/mlmd/library';
import {
  Artifact,
  ArtifactType,
  GetArtifactsRequest,
  GetArtifactsResponse,
  GetArtifactTypesResponse,
  Value,
} from 'src/third_party/mlmd';
import { ListOperationOptions } from 'src/third_party/mlmd/generated/ml_metadata/proto/metadata_store_pb';
import { RoutePage } from 'src/components/Router';
import TestUtils from 'src/TestUtils';
import { ArtifactList } from 'src/pages/ArtifactList';
import { PageProps } from 'src/pages/Page';

describe('ArtifactList', () => {
  const updateBannerSpy = jest.fn();
  const updateDialogSpy = jest.fn();
  const updateSnackbarSpy = jest.fn();
  const updateToolbarSpy = jest.fn();
  const historyPushSpy = jest.fn();

  const getArtifactsSpy = jest.spyOn(Api.getInstance().metadataStoreService, 'getArtifacts');
  const getArtifactTypesSpy = jest.spyOn(
    Api.getInstance().metadataStoreService,
    'getArtifactTypes',
  );

  const listOperationOpts = new ListOperationOptions();
  listOperationOpts.setMaxResultSize(10);
  const getArtifactsRequest = new GetArtifactsRequest();
  getArtifactsRequest.setOptions(listOperationOpts),
    beforeEach(() => {
      getArtifactTypesSpy.mockImplementation(() => {
        const artifactType = new ArtifactType();
        artifactType.setId(6);
        artifactType.setName('String');
        const response = new GetArtifactTypesResponse();
        response.setArtifactTypesList([artifactType]);
        return Promise.resolve(response);
      });
      getArtifactsSpy.mockImplementation(() => {
        const artifacts = generateNArtifacts(10);
        const response = new GetArtifactsResponse();
        response.setArtifactsList(artifacts);
        return Promise.resolve(response);
      });
    });

  function generateNArtifacts(n: number) {
    let artifacts: Artifact[] = [];
    for (let i = 1; i <= n; i++) {
      const artifact = new Artifact();
      const pipelineValue = new Value();
      const pipelineName = `pipeline ${i}`;
      pipelineValue.setStringValue(pipelineName);
      artifact.getPropertiesMap().set('pipeline_name', pipelineValue);
      const artifactValue = new Value();
      const artifactName = `artifact ${i}`;
      artifactValue.setStringValue(artifactName);
      artifact.getPropertiesMap().set('name', artifactValue);
      artifact.setName(artifactName);
      artifacts.push(artifact);
    }
    return artifacts;
  }

  function generateProps(): PageProps {
    return TestUtils.generatePageProps(
      ArtifactList,
      { pathname: RoutePage.ARTIFACTS } as any,
      '' as any,
      historyPushSpy,
      updateBannerSpy,
      updateDialogSpy,
      updateToolbarSpy,
      updateSnackbarSpy,
    );
  }

  it('renders one artifact', async () => {
    getArtifactsSpy.mockImplementation(() => {
      const artifacts = generateNArtifacts(1);
      const response = new GetArtifactsResponse();
      response.setArtifactsList(artifacts);
      return Promise.resolve(response);
    });
    render(
      <MemoryRouter>
        <ArtifactList {...generateProps()} />
      </MemoryRouter>,
    );
    await TestUtils.flushPromises();

    expect(getArtifactTypesSpy).toHaveBeenCalledTimes(1);
    expect(getArtifactsSpy).toHaveBeenCalledTimes(1);

    screen.getByText('pipeline 1');
    screen.getByText('artifact 1');
  });

  it('displays footer with "10" as default value', async () => {
    render(
      <MemoryRouter>
        <ArtifactList {...generateProps()} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(getArtifactTypesSpy).toHaveBeenCalledTimes(1);
      expect(getArtifactsSpy).toHaveBeenCalledTimes(1);
    });

    screen.getByText('Rows per page:');
    screen.getByText('10');
  });

  it('it able to see the 20th artifact if "Rows per page" is chanegd to 20', async () => {
    render(
      <MemoryRouter>
        <ArtifactList {...generateProps()} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(getArtifactTypesSpy).toHaveBeenCalledTimes(1);
      expect(getArtifactsSpy).toHaveBeenCalledTimes(1);
    });
    expect(screen.queryByText('artifact 20')).toBeNull(); // Can not see the 20th artifact initially

    getArtifactsSpy.mockImplementation(() => {
      const artifacts = generateNArtifacts(20);
      const response = new GetArtifactsResponse();
      response.setArtifactsList(artifacts);
      return Promise.resolve(response);
    });

    const originalRowsPerPage = screen.getByText('10');
    fireEvent.click(originalRowsPerPage);
    const newRowsPerPage = screen.getByText('20'); // Change to render 20 rows per page.
    fireEvent.click(newRowsPerPage);

    listOperationOpts.setMaxResultSize(20);
    getArtifactsRequest.setOptions(listOperationOpts),
      await waitFor(() => {
        // API will be called again if "Rows per page" is changed
        expect(getArtifactsSpy).toHaveBeenLastCalledWith(getArtifactsRequest);
      });

    screen.getByText('artifact 20'); // The 20th artifacts appears.
  });

  it('found no artifact', async () => {
    getArtifactsSpy.mockClear();
    getArtifactsSpy.mockImplementation(() => {
      const response = new GetArtifactsResponse();
      response.setArtifactsList([]);
      return Promise.resolve(response);
    });
    render(
      <MemoryRouter>
        <ArtifactList {...generateProps()} />
      </MemoryRouter>,
    );
    await TestUtils.flushPromises();

    screen.getByText('No artifacts found.');
  });
});
