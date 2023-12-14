import {Component} from 'react'

import {Link} from 'react-router-dom'
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import Loader from 'react-loader-spinner'

import LatestMatch from '../LatestMatch'
import MatchCard from '../MatchCard'

import './index.css'

const matchData = {Won: 0, Lost: 0, Drawn: 0}

const teamMatchesApiUrl = 'https://apis.ccbp.in/ipl/'

class TeamMatches extends Component {
  state = {
    isLoading: true,
    teamMatchesData: {},
  }

  componentDidMount() {
    this.getTeamMatches()
  }

  getFormattedData = data => {
    if (data.match_status === 'Won') {
      matchData.Won += 1
    } else if (data.match_status === 'Lost') {
      matchData.Lost += 1
    } else {
      matchData.Drawn += 1
    }
    return {
      umpires: data.umpires,
      result: data.result,
      manOfTheMatch: data.man_of_the_match,
      id: data.id,
      date: data.date,
      venue: data.venue,
      competingTeam: data.competing_team,
      competingTeamLogo: data.competing_team_logo,
      firstInnings: data.first_innings,
      secondInnings: data.second_innings,
      matchStatus: data.match_status,
    }
  }

  getTeamMatches = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const response = await fetch(`${teamMatchesApiUrl}${id}`)
    const fetchedData = await response.json()
    const formattedData = {
      teamBannerURL: fetchedData.team_banner_url,
      latestMatch: this.getFormattedData(fetchedData.latest_match_details),
      recentMatches: fetchedData.recent_matches.map(eachMatch =>
        this.getFormattedData(eachMatch),
      ),
    }

    this.setState({teamMatchesData: formattedData, isLoading: false})
  }

  renderRecentMatchesList = () => {
    const {teamMatchesData} = this.state
    const {recentMatches} = teamMatchesData

    return (
      <ul className="recent-matches-list">
        {recentMatches.map(recentMatch => (
          <MatchCard matchDetails={recentMatch} key={recentMatch.id} />
        ))}
      </ul>
    )
  }

  picChart = () => {
    const k = 'k'
    const datas = [
      {name: 'Won', value: matchData.Won, color: '#a44c9e'},
      {name: 'Lost', value: matchData.Lost, color: '#fecba6'},
      {name: 'Drawn', value: matchData.Drawn, color: '#b3d23f'},
    ]
    console.log(datas)

    return (
      <div className="chart">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              cx="50%"
              cy="50%"
              data={datas}
              startAngle={0}
              endAngle={360}
              labelLine={false}
              innerRadius="70%"
              outerRadius="100%"
              dataKey="value"
            >
              {datas.map(e => (
                <Cell name={e.name} fill={e.color} key={e.value} />
              ))}
            </Pie>
            <Legend
              iconType="circle"
              layout="vertical"
              verticalAlign="middle"
              align="right"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }

  renderTeamMatches = () => {
    const {teamMatchesData} = this.state
    const {teamBannerURL, latestMatch} = teamMatchesData

    return (
      <div className="responsive-container">
        <img src={teamBannerURL} alt="team banner" className="team-banner" />
        <LatestMatch latestMatchData={latestMatch} />
        {this.picChart()}
        {this.renderRecentMatchesList()}
      </div>
    )
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="Oval" color="#ffffff" height={50} />
    </div>
  )

  getRouteClassName = () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    switch (id) {
      case 'RCB':
        return 'rcb'
      case 'KKR':
        return 'kkr'
      case 'KXP':
        return 'kxp'
      case 'CSK':
        return 'csk'
      case 'RR':
        return 'rr'
      case 'MI':
        return 'mi'
      case 'SH':
        return 'srh'
      case 'DC':
        return 'dc'
      default:
        return ''
    }
  }

  render() {
    const {isLoading} = this.state
    const className = `team-matches-container ${this.getRouteClassName()}`

    return (
      <div className={className}>
        <Link to="/">
          <button className="backButton" type="button">
            Back
          </button>
        </Link>
        {isLoading ? this.renderLoader() : this.renderTeamMatches()}
      </div>
    )
  }
}

export default TeamMatches
