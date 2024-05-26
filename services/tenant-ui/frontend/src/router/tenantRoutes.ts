// Main dashboard
import Dashboard from '@/views/Dashboard.vue';
import About from '@/views/About.vue';
// Tenant
import TenantUi from '@/views/TenantUi.vue';
import Profile from '@/views/tenant/Profile.vue';
import Settings from '@/views/tenant/Settings.vue';
import Developer from '@/views/tenant/Developer.vue';
// Connections
import MyConnections from '@/views/connections/MyConnections.vue';
import MyInvitations from '@/views/connections/MyInvitations.vue';
// Issuance
import MyIssuedCredentials from '@/views/issuance/MyIssuedCredentials.vue';
import Schemas from '@/views/issuance/Schemas.vue';
import CredentialDefinitions from '@/views/issuance/CredentialDefinitions.vue';
// Verifictation
import MyPresentations from '@/views/verification/MyPresentations.vue';
// Holder
import MyHeldCredentials from '@/views/holder/MyHeldCredentials.vue';
// Messages
import MyMessages from '@/views/messages/MyMessages.vue';
// OCA
import Oca from '@/views/oca/Oca.vue';
// API Keys
import ApiKeys from '@/views/ApiKeys.vue';
// Blockchain Event Management
import RegisterExam from '@/views/blockchain/exam/RegisterExam.vue';
import UpdateExam from '@/views/blockchain/exam/UpdateExam.vue';
import ListExams from '@/views/blockchain/exam/ListExams.vue';
import RegisterDiagnosis from '@/views/blockchain/diagnosis/RegisterDiagnosis.vue';
import ListDiagnoses from '@/views/blockchain/diagnosis/ListDiagnoses.vue';
import RegisterTreatment from '@/views/blockchain/treatment/RegisterTreatment.vue';
import ListTreatments from '@/views/blockchain/treatment/ListTreatments.vue';
import ListSSISHEvents from '@/views/blockchain/ListSSISHEvents.vue';
import MyVerifiableCredentials from '@/views/blockchain/MyVerifiableCredentials.vue';
import MyWallet from '@/views/blockchain/MyWallet.vue';
// Const
import { RESERVATION_STATUS_ROUTE } from '@/helpers/constants';

const tenantRoutes = [
  // Tenant Routes (base / is Tenant side for this app)
  {
    path: '/',
    name: 'TenantUi',
    component: TenantUi,
    children: [
      { path: 'dashboard', name: 'Dashboard', component: Dashboard },

      // About
      {
        path: '/about',
        name: 'About',
        component: About,
      },

      // Tenant - Setup etc
      {
        path: '/tenant/',
        children: [
          {
            path: 'profile',
            name: 'Profile',
            component: Profile,
          },
          {
            path: 'settings',
            name: 'Settings',
            component: Settings,
          },
          {
            path: 'developer',
            name: 'Developer',
            component: Developer,
          },
        ],
      },

      // Tenant - Connections
      {
        path: '/connections/',
        children: [
          {
            path: '',
            name: 'MyConnections',
            component: MyConnections,
          },
          {
            path: 'invitations',
            name: 'MyInvitations',
            component: MyInvitations,
          },
        ],
      },

      // Tenant - Schemas, templates etc
      {
        path: 'schemas',
        name: 'Schemas',
        component: Schemas,
      },
      {
        path: 'credentialDefinitions',
        name: 'CredentialDefinitions',
        component: CredentialDefinitions,
      },
      {
        path: 'oca',
        name: 'OCA',
        component: Oca,
      },

      // Tenant - Issuer
      {
        path: '/issuance/',
        children: [
          {
            path: 'credentials',
            name: 'MyIssuedCredentials',
            component: MyIssuedCredentials,
          },
        ],
      },

      // Tenant - Verifier
      {
        path: '/verification/',
        children: [
          {
            path: 'verifications',
            name: 'MyPresentations',
            component: MyPresentations,
          },
        ],
      },

      // Tenant - Holder
      {
        path: '/holder/',
        children: [
          {
            path: 'credentials',
            name: 'MyHeldCredentials',
            component: MyHeldCredentials,
          },
        ],
      },

      // Tenant - Messages
      {
        path: '/messages',
        children: [
          {
            path: 'recent',
            name: 'MyMessages',
            component: MyMessages,
          },
        ],
      },

      // Tenant - API Keys
      {
        path: 'authentications/keys',
        name: 'ApiKeys',
        component: ApiKeys,
      },

      // Blockchain Event Management
      {
        path: '/blockchain/exam/register-exam',
        name: 'RegisterExam',
        component: RegisterExam,
      },
      {
        path: '/blockchain/exam/update-exam',
        name: 'UpdateExam',
        component: UpdateExam,
      },
      {
        path: '/blockchain/exam/list-exams',
        name: 'ListExams',
        component: ListExams,
      },
      {
        path: '/blockchain/diagnosis/register-diagnosis',
        name: 'RegisterDiagnosis',
        component: RegisterDiagnosis,
      },
      {
        path: '/blockchain/diagnosis/list-diagnoses',
        name: 'ListDiagnoses',
        component: ListDiagnoses,
      },
      {
        path: '/blockchain/treatment/register-treatment',
        name: 'RegisterTreatment',
        component: RegisterTreatment,
      },
      {
        path: '/blockchain/treatment/list-treatments',
        name: 'ListTreatments',
        component: ListTreatments,
      },
      {
        path: '/blockchain/events-ssish',
        name: 'ListSSISHEvents',
        component: ListSSISHEvents,
      },
      {
        path: '/blockchain/my-verifiable-credentials',
        name: 'MyVerifiableCredentials',
        component: MyVerifiableCredentials,
      },
      {
        path: '/blockchain/my-wallet',
        name: 'MyWallet',
        component: MyWallet,
      },
    ],
  },
  // Direct back to the status checking page for reservations
  {
    path: `/${RESERVATION_STATUS_ROUTE}`,
    name: 'TenantUiReservationStatus',
    component: TenantUi,
  },
];

export default tenantRoutes;
