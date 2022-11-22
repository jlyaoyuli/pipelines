// Code generated by go-swagger; DO NOT EDIT.

package pipeline_service

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"fmt"
	"io"

	"github.com/go-openapi/runtime"

	strfmt "github.com/go-openapi/strfmt"

	pipeline_model "github.com/kubeflow/pipelines/backend/api/v1beta1/go_http_client/pipeline_model"
)

// GetPipelineByNameV1Reader is a Reader for the GetPipelineByNameV1 structure.
type GetPipelineByNameV1Reader struct {
	formats strfmt.Registry
}

// ReadResponse reads a server response into the received o.
func (o *GetPipelineByNameV1Reader) ReadResponse(response runtime.ClientResponse, consumer runtime.Consumer) (interface{}, error) {
	switch response.Code() {

	case 200:
		result := NewGetPipelineByNameV1OK()
		if err := result.readResponse(response, consumer, o.formats); err != nil {
			return nil, err
		}
		return result, nil

	default:
		result := NewGetPipelineByNameV1Default(response.Code())
		if err := result.readResponse(response, consumer, o.formats); err != nil {
			return nil, err
		}
		if response.Code()/100 == 2 {
			return result, nil
		}
		return nil, result
	}
}

// NewGetPipelineByNameV1OK creates a GetPipelineByNameV1OK with default headers values
func NewGetPipelineByNameV1OK() *GetPipelineByNameV1OK {
	return &GetPipelineByNameV1OK{}
}

/*GetPipelineByNameV1OK handles this case with default header values.

A successful response.
*/
type GetPipelineByNameV1OK struct {
	Payload *pipeline_model.APIPipeline
}

func (o *GetPipelineByNameV1OK) Error() string {
	return fmt.Sprintf("[GET /apis/v1beta1/namespaces/{namespace}/pipelines/{name}][%d] getPipelineByNameV1OK  %+v", 200, o.Payload)
}

func (o *GetPipelineByNameV1OK) readResponse(response runtime.ClientResponse, consumer runtime.Consumer, formats strfmt.Registry) error {

	o.Payload = new(pipeline_model.APIPipeline)

	// response payload
	if err := consumer.Consume(response.Body(), o.Payload); err != nil && err != io.EOF {
		return err
	}

	return nil
}

// NewGetPipelineByNameV1Default creates a GetPipelineByNameV1Default with default headers values
func NewGetPipelineByNameV1Default(code int) *GetPipelineByNameV1Default {
	return &GetPipelineByNameV1Default{
		_statusCode: code,
	}
}

/*GetPipelineByNameV1Default handles this case with default header values.

GetPipelineByNameV1Default get pipeline by name v1 default
*/
type GetPipelineByNameV1Default struct {
	_statusCode int

	Payload *pipeline_model.APIStatus
}

// Code gets the status code for the get pipeline by name v1 default response
func (o *GetPipelineByNameV1Default) Code() int {
	return o._statusCode
}

func (o *GetPipelineByNameV1Default) Error() string {
	return fmt.Sprintf("[GET /apis/v1beta1/namespaces/{namespace}/pipelines/{name}][%d] GetPipelineByNameV1 default  %+v", o._statusCode, o.Payload)
}

func (o *GetPipelineByNameV1Default) readResponse(response runtime.ClientResponse, consumer runtime.Consumer, formats strfmt.Registry) error {

	o.Payload = new(pipeline_model.APIStatus)

	// response payload
	if err := consumer.Consume(response.Body(), o.Payload); err != nil && err != io.EOF {
		return err
	}

	return nil
}
