// ** Icon imports
import Login from 'mdi-material-ui/Login'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import BookOpenBlankVariant from 'mdi-material-ui/BookOpenBlankVariant'
import TrophyAward from 'mdi-material-ui/TrophyAward'
import School from 'mdi-material-ui/School'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { UserType } from "../../services/store";


const navigation = ( userType: number ): VerticalNavItemsType => {

  switch (userType) {
    case UserType.CONTENT_CREATOR:
      return [
        {
          sectionTitle: 'Dashboard'
        },
        {
          title: 'Account Details',
          icon: HomeOutline,
          path: '/sponsorDashboard'
        },
        {
          sectionTitle: 'Pages'
        },
        {
          title: 'Leaderboard',
          icon: TrophyAward,
          path: '/leaderboard'
        },
        {
          title: 'Courses',
          icon: School,
          path: '/contentCreatorCourses'
        },
        {
          title: 'Modules',
          icon: BookOpenBlankVariant,
          path: '/contentCreatorCourseModules'
        }
      ]
    case UserType.LEARNER:
      return [
        {
          sectionTitle: 'Dashboard'
        },
        {
          title: 'Account Details',
          icon: HomeOutline,
          path: '/learnerDashboard'
        },
        {
          sectionTitle: 'Pages'
        },
        {
          title: 'Leaderboard',
          icon: TrophyAward,
          path: '/leaderboard'
        },
        {
          title: 'Courses',
          icon: BookOpenBlankVariant,
          path: '/learnerCourses'
        }
      ]
    default:
      return [
        {
          title: 'Enroll',
          icon: Login,
          path: '/chooseRole'
        }
      ]
  }
}

export default navigation
