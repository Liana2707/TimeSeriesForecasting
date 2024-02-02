# Time Series Forecasting System


In conditions of limited resources, when quick decision-making is necessary, the creation of a time series trend prediction system becomes extremely important. The key aspect of developing such a system is taking into account noise in the data caused by random errors and limited statistical information. This web application is a prototype of such a system.

## Directory Structure

- `server/`: Server-side code (Flask).
- `client/`: Client-side code (React).

## Requirements

- **Server-side:**
  - Python (specified in `requirements.txt`)
  - (other dependencies as specified in `requirements.txt`)

- **Client-side:**
  - Node.js (specified in `package.json`)
  - npm (specified in `package.json`)
  - (other dependencies as specified in `package.json`)

  ## Installation

1. Clone the repository
2. **Server-side:**
   - Navigate to the server folder \
    `cd server`
   - Create and activate a virtual environment \
   `python -m venv venv` \
   `source venv/bin/activate`  

   - Install server dependencies:  
   `pip install -r requirements.txt`
3. **Client-side:**
   - Navigate to the client folder: \
    `cd client`
   - Install client dependencies:
    `npm install`



## Running

1. **Server-side:**
   - Navigate to the client folder:
    `cd server`
   - Start the server: `python3 server.py`
2. **Client-side:**
   - In another terminal, navigate to the client folder:
    `cd client`
   - Start the client: 
   `npm start`

The application will be accessible at [http://localhost:5000](http://localhost:5000).



## Contact

For questions or suggestions, please contact us via email: liana300291@gmail.com.
