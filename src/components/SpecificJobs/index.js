import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {IoLocation} from 'react-icons/io5'
import {FaSuitcaseRolling, FaExternalLinkAlt} from 'react-icons/fa'
import Header from '../Header'

import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  pending: 'PENDING',
  failure: 'FAILURE',
}

class SpecificJobs extends Component {
  state = {
    jobData: {},
    similarJobs: [],
    apiStatus: apiConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
    this.setState({apiStatus: apiConstants.pending})
  }

  getJobDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {jobId} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${jobId}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.setState({
        jobData: data.job_details,
        similarJobs: data.similar_jobs,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  renderJobFailureView = () => (
    <div className="job-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1>Oops Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        type="button"
        className="failure-btn"
        onClick={this.getJobDetails}
      >
        Retry
      </button>
    </div>
  )

  renderSpecificJobView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.renderSpecificJobSuccessView()
      case apiConstants.pending:
        return this.renderLoaderView()
      case apiConstants.failure:
        return this.renderJobFailureView()
      default:
        return null
    }
  }

  renderSpecificJobSuccessView = () => {
    const {jobData, skills, similarJobs} = this.state
    return (
      <>
        <div className="specific-job-card">
          <div className="job-heading">
            <img
              className="job-card-logo"
              src={jobData.company_logo_url}
              alt="company logo"
            />
            <div className="job-card-title-rating">
              <p className="job-card-title">{jobData.title}</p>
              <p className="job-card-rating">&#9733; {jobData.rating}</p>
            </div>
          </div>
          <div className="job-type-desc">
            <div className="job-type-location-type">
              <p>
                <IoLocation />
                {jobData.location}
              </p>
              <p>
                <FaSuitcaseRolling />
                {jobData.employment_type}
              </p>
            </div>
            <p>{jobData.package_per_annum}</p>
          </div>
          <hr />
          <div className="specific-job-description-heading">
            <strong>Description</strong>
            <Link to={jobData.company_website_url} style={{color: ' #b6c5ff'}}>
              <strong>
                Visit
                <FaExternalLinkAlt />
              </strong>
            </Link>
          </div>
          <p>{jobData.job_description}</p>
          <strong>Skills</strong>
          {skills && (
            <ul className="skills-container">
              {skills.map(each => (
                <li key={each.name}>
                  <div className="skill-item">
                    <img src={each.image_url} alt={each.name} />
                    <p>{each.name}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <h1>Life at Company</h1>
          <div className="about-company-culture">
            <p>{jobData.life_at_company?.description}</p>
            <img src={jobData.life_at_company?.image_url} alt="company logo" />
          </div>
        </div>
        <h1>Similar Jobs</h1>
        <div className="similar-jobs-container">
          <ul className="similar-jobs">
            {similarJobs.map(each => (
              <li key={each.id}>
                <div className="similar-job-item">
                  <div className="job-heading">
                    <img
                      className="job-card-logo"
                      src={each.company_logo_url}
                      alt="company logo"
                    />
                    <div className="job-card-title-rating">
                      <p className="job-card-title">{each.title}</p>
                      <p className="job-card-rating">&#9733; {each.rating}</p>
                    </div>
                  </div>
                  <strong>Description</strong>
                  <p>{each.job_description}</p>
                  <div className="job-type-location-type">
                    <p>
                      <IoLocation />
                      {jobData.location}
                    </p>
                    <p>
                      <FaSuitcaseRolling />
                      {jobData.employment_type}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    return (
      <div className="specific-job-container">
        <Header />
        {this.renderSpecificJobView()}
      </div>
    )
  }
}

export default SpecificJobs
