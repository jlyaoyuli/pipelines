// Code generated by go-swagger; DO NOT EDIT.

package experiment_service

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"context"
	"net/http"
	"time"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime"
	cr "github.com/go-openapi/runtime/client"

	strfmt "github.com/go-openapi/strfmt"
)

// NewArchiveExperimentV1Params creates a new ArchiveExperimentV1Params object
// with the default values initialized.
func NewArchiveExperimentV1Params() *ArchiveExperimentV1Params {
	var ()
	return &ArchiveExperimentV1Params{

		timeout: cr.DefaultTimeout,
	}
}

// NewArchiveExperimentV1ParamsWithTimeout creates a new ArchiveExperimentV1Params object
// with the default values initialized, and the ability to set a timeout on a request
func NewArchiveExperimentV1ParamsWithTimeout(timeout time.Duration) *ArchiveExperimentV1Params {
	var ()
	return &ArchiveExperimentV1Params{

		timeout: timeout,
	}
}

// NewArchiveExperimentV1ParamsWithContext creates a new ArchiveExperimentV1Params object
// with the default values initialized, and the ability to set a context for a request
func NewArchiveExperimentV1ParamsWithContext(ctx context.Context) *ArchiveExperimentV1Params {
	var ()
	return &ArchiveExperimentV1Params{

		Context: ctx,
	}
}

// NewArchiveExperimentV1ParamsWithHTTPClient creates a new ArchiveExperimentV1Params object
// with the default values initialized, and the ability to set a custom HTTPClient for a request
func NewArchiveExperimentV1ParamsWithHTTPClient(client *http.Client) *ArchiveExperimentV1Params {
	var ()
	return &ArchiveExperimentV1Params{
		HTTPClient: client,
	}
}

/*ArchiveExperimentV1Params contains all the parameters to send to the API endpoint
for the archive experiment v1 operation typically these are written to a http.Request
*/
type ArchiveExperimentV1Params struct {

	/*ID
	  The ID of the experiment to be archived.

	*/
	ID string

	timeout    time.Duration
	Context    context.Context
	HTTPClient *http.Client
}

// WithTimeout adds the timeout to the archive experiment v1 params
func (o *ArchiveExperimentV1Params) WithTimeout(timeout time.Duration) *ArchiveExperimentV1Params {
	o.SetTimeout(timeout)
	return o
}

// SetTimeout adds the timeout to the archive experiment v1 params
func (o *ArchiveExperimentV1Params) SetTimeout(timeout time.Duration) {
	o.timeout = timeout
}

// WithContext adds the context to the archive experiment v1 params
func (o *ArchiveExperimentV1Params) WithContext(ctx context.Context) *ArchiveExperimentV1Params {
	o.SetContext(ctx)
	return o
}

// SetContext adds the context to the archive experiment v1 params
func (o *ArchiveExperimentV1Params) SetContext(ctx context.Context) {
	o.Context = ctx
}

// WithHTTPClient adds the HTTPClient to the archive experiment v1 params
func (o *ArchiveExperimentV1Params) WithHTTPClient(client *http.Client) *ArchiveExperimentV1Params {
	o.SetHTTPClient(client)
	return o
}

// SetHTTPClient adds the HTTPClient to the archive experiment v1 params
func (o *ArchiveExperimentV1Params) SetHTTPClient(client *http.Client) {
	o.HTTPClient = client
}

// WithID adds the id to the archive experiment v1 params
func (o *ArchiveExperimentV1Params) WithID(id string) *ArchiveExperimentV1Params {
	o.SetID(id)
	return o
}

// SetID adds the id to the archive experiment v1 params
func (o *ArchiveExperimentV1Params) SetID(id string) {
	o.ID = id
}

// WriteToRequest writes these params to a swagger request
func (o *ArchiveExperimentV1Params) WriteToRequest(r runtime.ClientRequest, reg strfmt.Registry) error {

	if err := r.SetTimeout(o.timeout); err != nil {
		return err
	}
	var res []error

	// path param id
	if err := r.SetPathParam("id", o.ID); err != nil {
		return err
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}
