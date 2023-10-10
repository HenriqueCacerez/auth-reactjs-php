import React from 'react'

function ContainerAuthBox( { title, children }) {
  return (
    <>
      <div className="container">
        <div className="row justify-content-md-center">
          <div className="col-md-12 col-lg-4">

            <div className="card login-box-container">
              <div className="card-body">
                
                  <div className="text-center authent-text mt-0">
                        <h1 className='h3'>{ title }</h1>
                    </div>

                {children}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default ContainerAuthBox;