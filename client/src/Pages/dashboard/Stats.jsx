import React,{useEffect} from 'react'
import { useAppContext } from "../../context/appContext";
import StatsContainer from '../../components/StatsContainer';
import Loading from '../../components/Loading';
import ChartsContainer from '../../components/ChartsContainer';

const Stats = () => {
  const { showStats, isLoading, monthlyApplications } = useAppContext();

  useEffect(() => {
    showStats()
  }, [])

  if (isLoading) {
    return <Loading center/>
  }
  return (
    <div>
      <StatsContainer/>
      {monthlyApplications.length > 0 && <ChartsContainer/>}
    </div>
  )
}

export default Stats