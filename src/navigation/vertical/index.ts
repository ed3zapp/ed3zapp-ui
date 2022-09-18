// ** Icon imports
import Login from 'mdi-material-ui/Login'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import BookOpenBlankVariant from 'mdi-material-ui/BookOpenBlankVariant'
import TrophyAward from 'mdi-material-ui/TrophyAward'

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
          path: '/ccTest'
        },
        {
          sectionTitle: 'Pages'
        },
        {
          title: 'Leaderboard',
          icon: TrophyAward,
          path: '/'
        },
        {
          title: 'Courses',
          icon: BookOpenBlankVariant,
          path: '/contentCreatorCourses'
        },
        {
          title: 'Modules',
          icon: BookOpenBlankVariant,
          path: '/'
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
          path: '/'
        },
        {
          sectionTitle: 'Pages'
        },
        {
          title: 'Leaderboard',
          icon: TrophyAward,
          path: '/'
        },
        {
          title: 'Courses',
          icon: BookOpenBlankVariant,
          path: '/'
        },
        {
          title: 'Modules',
          icon: BookOpenBlankVariant,
          path: '/'
        }
      ]
    default:
      return [
        {
          title: 'Enroll',
          icon: Login,
          path: '/'
        }
      ]
  }
}

export default navigation
