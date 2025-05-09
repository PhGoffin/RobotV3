import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Price from '../views/Price.vue'
import Login from '../views/user/Login.vue'
import Users from '../views/user/Users.vue'
import UserAdd from '../views/user/UserAdd.vue'
import UserEdit from '../views/user/UserEdit.vue'
import ChangePassword from '../views/user/ChangePassword.vue'
import Password from '../views/Password.vue'
import ControlPanel from '../views/ControlPanel.vue'
import Documentation from '../views/documentation/Documentation.vue'
import GuestPanel from '../views/GuestPanel.vue'
import Projects from '../views/project/Projects.vue'
import ProjectAdd from '../views/project/ProjectAdd.vue'
import ProjectEdit from '../views/project/ProjectEdit.vue'
import Subprojects from '../views/subproject/Subprojects.vue'
import SubprojectAdd from '../views/subproject/SubprojectAdd.vue'
import SubprojectEdit from '../views/subproject/SubprojectEdit.vue'
import UsersProject from '../views/project/UsersProject.vue'
import UserProjectAdd from '../views/project/UserProjectAdd.vue'
import UserProjectEdit from '../views/project/UserProjectEdit.vue'
import Workspaces from '../views/workspace/Workspaces.vue'
import WorkspaceAdd from '../views/workspace/WorkspaceAdd.vue'
import WorkspaceEdit from '../views/workspace/WorkspaceEdit.vue'
import Libraries from '../views/library/Libraries.vue'
import Licenses from '../views/license/Licenses.vue'
import Parameters from '../views/parameter/Parameters.vue'
import ParameterEdit from '../views/parameter/ParameterEdit.vue'
import Functions from '../views/function/Functions.vue'
import FunctionEdit from '../views/function/FunctionEdit.vue'
import Templates from '../views/template/Templates.vue'
import Ruleheaders from '../views/ruleheader/Ruleheaders.vue'
import RuleheaderEdit from '../views/ruleheader/RuleheaderEdit.vue'
import RuleheaderImport from '../views/ruleheader/RuleheaderImport.vue'
import Rules from '../views/rule/Rules.vue'
import RuleEdit from '../views/rule/RuleEdit.vue'
import RuleWizard from '../views/rule/RuleWizard.vue'
import Dictionary from '../views/dictionary/Dictionary.vue'
import DictionaryEdit from '../views/dictionary/DictionaryEdit.vue'
import DictionaryRename from '../views/dictionary/DictionaryRename.vue'
import Dictionaryheader from '../views/dictionaryheader/Dictionaryheader.vue'
import DictionaryheaderEdit from '../views/dictionaryheader/DictionaryheaderEdit.vue'
import NaturalProto from '../views/ai_natural/NaturalProto.vue'
import Natural from '../views/ai_natural/Natural.vue'
import NaturalEdit from '../views/ai_natural/NaturalEdit.vue'
import Naturalheader from '../views/ai_naturalheader/Naturalheader.vue'
import NaturalheaderEdit from '../views/ai_naturalheader/NaturalheaderEdit.vue'
import Batch from '../views/batch/Batch.vue'
import Storyheader from '../views/storyheader/Storyheader.vue'
import StoryheaderEdit from '../views/storyheader/StoryheaderEdit.vue'
import Stories from '../views/story/Stories.vue'
import StoryEdit from '../views/story/StoryEdit.vue'
import Suiteheader from '../views/suiteheader/Suiteheader.vue'
import SuiteheaderEdit from '../views/suiteheader/SuiteheaderEdit.vue'
import Suites from '../views/suite/Suites.vue'
import SuiteEdit from '../views/suite/SuiteEdit.vue'
import Scenarios from '../views/scenario/Scenarios.vue'
import ScenarioAdd from '../views/scenario/ScenarioAdd.vue'
import ScenarioEdit from '../views/scenario/ScenarioEdit.vue'
import ScenarioImport from '../views/scenario/ScenarioImport.vue'
import Tests from '../views/test/Tests.vue'
import TestEdit from '../views/test/TestEdit.vue'
import Dashboard from '../views/dashboard/Dashboard.vue'
import Logfiles from '../views/logfile/Logfiles.vue'
import LogReport from '../views/logfile/LogReport.vue'
import Gallery from '../views/gallery/Gallery.vue'
import Datasetheader from '../views/datasetheader/Datasetheader.vue'
import DatasetheaderEdit from '../views/datasetheader/DatasetheaderEdit.vue'
import DatasetheaderImport from '../views/datasetheader/DatasetheaderImport.vue'
import Dataset from '../views/dataset/Dataset.vue'
import DatasetEdit from '../views/dataset/DatasetEdit.vue'
import DatasetExport from '../views/dataset/DatasetExport.vue'
import References from '../views/reference/References.vue'
import ReferenceEdit from '../views/reference/ReferenceEdit.vue'
import ImportReference from '../views/referencebackupheader/ImportReference.vue'
import ExportReference from '../views/referencebackupheader/ExportReference.vue'
import Todo from '../views/todo/Todo.vue'
import Dummyusers from '../views/dummyuser/Dummyusers.vue'
import DummyuserEdit from '../views/dummyuser/DummyuserEdit.vue'
import Patterns from '../views/pattern/Patterns.vue'
import PatternEdit from '../views/pattern/PatternEdit.vue'
import Upload from '../views/upload/Upload.vue'
import AIRobot from '../views/ai_robot/AIRobot.vue'
import AISelector from '../views/ai_selector/AISelector.vue'
import AISelectorEdit from '../views/ai_selector/AISelectorEdit.vue'
import AIPath from '../views/ai_path/AIPath.vue'
import AIPathEdit from '../views/ai_path/AIPathEdit.vue'
import AIAttribute from '../views/ai_attribute/AIAttribute.vue'
import AIAttributeEdit from '../views/ai_attribute/AIAttributeEdit.vue'
import AITagElement from '../views/ai_tagelement/AITagElement.vue'
import AITagAttribute from '../views/ai_tagattribute/AITagAttribute.vue'
import AITagAttributeEdit from '../views/ai_tagattribute/AITagAttributeEdit.vue'
import AITraining from '../views/ai_training/AITraining.vue'
import AITrainingEdit from '../views/ai_training/AITrainingEdit.vue'
import AIDashboard from '../views/ai_dashboard/AIDashboard.vue'
import Performance from '../views/performance/Performance.vue'



const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    props: true
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    props: true
  },
  {
    path: '/price',
    name: 'Price',
    component: Price,
    props: true
  },
  {
    path: '/ctrlpanel',
    name: 'ControlPanel',
    component: ControlPanel,
    props: true
  },
  {
    path: '/documentation',
    name: 'Documentation',
    component: Documentation,
    props: true
  },
  {
    path: '/guestpanel',
    name: 'GuestPanel',
    component: GuestPanel,
    props: true
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    props: true
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
    props: true
  },
  {
    path: '/user/Edit/:id',
    name: 'UserEdit',
    component: UserEdit,
    props: true
  },
  {
    path: '/user/Add',
    name: 'UserAdd',
    component: UserAdd,
    props: true
  },
  {
    path: '/changepassword/:id/:location',
    name: 'ChangePassword',
    component: ChangePassword,
    props: true
  },
  {
    path: '/Password',
    name: 'Password',
    component: Password,
    props: true
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects,
    props: true
  },
  {
    path: '/project/Add',
    name: 'ProjectAdd',
    component: ProjectAdd,
    props: true
  },
  {
    path: '/project/:id',
    name: 'ProjectEdit',
    component: ProjectEdit,
    props: true
  },
  {
    path: '/workspaces',
    name: 'Workspaces',
    component: Workspaces,
    props: true
  },
  {
    path: '/workspace/Add',
    name: 'WorkspaceAdd',
    component: WorkspaceAdd,
    props: true
  },
  {
    path: '/workspace/:id',
    name: 'WorkspaceEdit',
    component: WorkspaceEdit,
    props: true
  },
  {
    path: '/project/subproject/:id',
    name: 'Subprojects',
    component: Subprojects,
    props: true
  },
  {
    path: '/project/subproject/Add',
    name: 'SubprojectAdd',
    component: SubprojectAdd,
    props: true
  },
  {
    path: '/project/subproject/Edit/:id',
    name: 'SubprojectEdit',
    component: SubprojectEdit,
    props: true
  },
  {
    path: '/project/UserProject/:id',
    name: 'UsersProject',
    component: UsersProject,
    props: true
  },
  {
    path: '/project/UserProject/Edit/:id',
    name: 'UserProjectEdit',
    component: UserProjectEdit,
    props: true
  },
  {
    path: '/project/UserProject/Add',
    name: 'UserProjectAdd',
    component: UserProjectAdd,
    props: true
  },
  {
    path: '/libraries',
    name: 'Libraries',
    component: Libraries,
    props: true
  },
  {
    path: '/licences',
    name: 'Licenses',
    component: Licenses,
    props: true
  },
  {
    path: '/parameters',
    name: 'Parameters',
    component: Parameters,
    props: true
  },
  {
    path: '/parameter/Edit/:id',
    name: 'ParameterEdit',
    component: ParameterEdit,
    props: true
  },
  {
    path: '/functions',
    name: 'Functions',
    component: Functions,
    props: true
  },
  {
    path: '/function/Edit/:id',
    name: 'FunctionEdit',
    component: FunctionEdit,
    props: true
  },
  {
    path: '/templates',
    name: 'Templates',
    component: Templates,
    props: true
  },
  {
    path: '/rulewizard',
    name: 'RuleWizard',
    component: RuleWizard,
    props: true
  },
  {
    path: '/ruleset/rules/:id',
    name: 'Rules',
    component: Rules,
    props: true
  },
  {
    path: '/ruleset/rule/Edit/:id',
    name: 'RuleEdit',
    component: RuleEdit,
    props: true
  },
  {
    path: '/ruleset',
    name: 'Rules Set',
    component: Ruleheaders,
    props: true
  },
  {
    path: '/ruleset/Edit/:id',
    name: 'RuleheaderEdit',
    component: RuleheaderEdit,
    props: true
  },  
  {
    path: '/ruleset/Import',
    name: 'RuleImport',
    component: RuleheaderImport,
    props: true
  },
  {
    path: '/dictionaryheader',
    name: 'Dictionary Set',
    component: Dictionaryheader,
    props: true
  },
  {
    path: '/dictionaryheader/Edit/:id',
    name: 'DictionaryheaderEdit',
    component: DictionaryheaderEdit,
    props: true
  },
  {
    path: '/dictionary/:id',
    name: 'Dictionary',
    component: Dictionary,
    props: true
  },
  {
    path: '/dictionary/Edit/:id',
    name: 'DictionaryEdit',
    component: DictionaryEdit,
    props: true
  },
  {
    path: '/dictionary/Rename/:id',
    name: 'DictionaryRename',
    component: DictionaryRename,
    props: true
  },
  {
    path: '/naturalproto',
    name: 'Natural Proto',
    component: NaturalProto,
    props: true
  },  
  {
    path: '/naturalheader',
    name: 'Natural Set',
    component: Naturalheader,
    props: true
  },
  {
    path: '/naturalheader/Edit/:id',
    name: 'NaturalheaderEdit',
    component: NaturalheaderEdit,
    props: true
  },
  {
    path: '/natural/:id',
    name: 'Natural',
    component: Natural,
    props: true
  },
  {
    path: '/natural/Edit/:id',
    name: 'NaturalEdit',
    component: NaturalEdit,
    props: true
  },
  {
    path: '/batch',
    name: 'Batch',
    component: Batch,
    props: true
  },
  {
    path: '/storyheader',
    name: 'Story Set',
    component: Storyheader,
    props: true
  },
  {
    path: '/storyheader/Edit/:id',
    name: 'StoryheaderEdit',
    component: StoryheaderEdit,
    props: true
  },
  {
    path: '/story/:id',
    name: 'Stories',
    component: Stories,
    props: true
  },
  {
    path: '/story/Edit/:id',
    name: 'StoryEdit',
    component: StoryEdit,
    props: true
  },
  {
    path: '/suiteheader',
    name: 'Suite Set',
    component: Suiteheader,
    props: true
  },
  {
    path: '/suiteheader/Edit/:id',
    name: 'SuiteheaderEdit',
    component: SuiteheaderEdit,
    props: true
  },
  {
    path: '/suites/:id',
    name: 'Suites',
    component: Suites,
    props: true
  },
  {
    path: '/suite/Edit/:id',
    name: 'SuiteEdit',
    component: SuiteEdit,
    props: true
  },
  {
    path: '/scenarios',
    name: 'Scenarios',
    component: Scenarios,
    props: true
  },
  {
    path: '/scenario/Add',
    name: 'ScenarioAdd',
    component: ScenarioAdd,
    props: true
  },
  {
    path: '/scenario/Import',
    name: 'ScenarioImport',
    component: ScenarioImport,
    props: true
  },
  {
    path: '/scenario/Edit/:id',
    name: 'ScenarioEdit',
    component: ScenarioEdit,
    props: true
  },
  {
    path: '/scenario/tests/:id',
    name: 'Tests',
    component: Tests,
    props: true
  },
  {
    path: '/scenario/test/Edit/:id',
    name: 'TestEdit',
    component: TestEdit,
    props: true
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    props: true
  },
  {
    path: '/logfile',
    name: 'Logfiles',
    component: Logfiles,
    props: true
  },
  {
    path: '/logReport',
    name: 'LogReport',
    component: LogReport,
    props: true
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: Gallery,
    props: true
  },
  {
    path: '/dataset',
    name: 'Dataset',
    component: Datasetheader,
    props: true
  },
  {
    path: '/dataset/Edit/:id',
    name: 'DatasetEdit',
    component: DatasetheaderEdit,
    props: true
  },
  {
    path: '/dataset/Import',
    name: 'DatasetheaderImport',
    component: DatasetheaderImport,
    props: true
  },  
  {
    path: '/data/:id',
    name: 'Data',
    component: Dataset,
    props: true
  },
  {
    path: '/data/Edit/:id',
    name: 'DataEdit',
    component: DatasetEdit,
    props: true
  },
  {
    path: '/dataset/export',
    name: 'DataExport',
    component: DatasetExport,
    props: true
  },
  {
    path: '/reference',
    name: 'References',
    component: References,
    props: true
  },
  {
    path: '/reference/Edit/:id/:currentuser',
    name: 'ReferenceEdit',
    component: ReferenceEdit,
    props: true
  },
  {
    path: '/reference/Export',
    name: 'ReferenceExport',
    component: ExportReference,
    props: true
  },
  {
    path: '/reference/Import',
    name: 'ReferenceImport',
    component: ImportReference,
    props: true
  },
  {
    path: '/dummyuser',
    name: 'Dummy Users',
    component: Dummyusers,
    props: true
  },
  {
    path: '/dummyuser/Edit/:id',
    name: 'DummyuserEdit',
    component: DummyuserEdit,
    props: true
  },
  {
    path: '/pattern',
    name: 'Patterns',
    component: Patterns,
    props: true
  },
  {
    path: '/pattern/Edit/:id',
    name: 'PatternEdit',
    component: PatternEdit,
    props: true
  },
  {
    path: '/upload',
    name: 'Upload',
    component: Upload,
    props: true
  },
  {
    path: '/todo',
    name: 'Todo',
    component: Todo,
    props: true
  },
  {
    path: '/airobot',
    name: 'AIRobot',
    component: AIRobot,
    props: true
  },
  {
    path: '/aiselector',
    name: 'AISelector',
    component: AISelector,
    props: true
  },
  {
    path: '/aiselector/Edit/:id',
    name: 'AISelectorEdit',
    component: AISelectorEdit,
    props: true
  },
  {
    path: '/aipath',
    name: 'AIPath',
    component: AIPath,
    props: true
  },
  {
    path: '/aipath/Edit/:id',
    name: 'AIPathEdit',
    component: AIPathEdit,
    props: true
  },
  {
    path: '/aiattribute',
    name: 'AIAttribute',
    component: AIAttribute,
    props: true
  },
  {
    path: '/aiattribute/Edit/:id',
    name: 'AIAttributeEdit',
    component: AIAttributeEdit,
    props: true
  },
  {
    path: '/aitagelement/:id',
    name: 'AITagElement',
    component: AITagElement,
    props: true
  },  
  {
    path: '/aitagattribute/:id',
    name: 'AITagAttribute',
    component: AITagAttribute,
    props: true
  },
  {
    path: '/aitagattribute/Edit/:id',
    name: 'AITagAttributeEdit',
    component: AITagAttributeEdit,
    props: true
  },
  {
    path: '/aitraining',
    name: 'AITraining',
    component: AITraining,
    props: true
  },
  {
    path: '/aitraining/Edit/:id',
    name: 'AITrainingEdit',
    component: AITrainingEdit,
    props: true
  },
  {
    path: '/aidashboard',
    name: 'AIDashboard',
    component: AIDashboard,
    props: true
  },
  {
    path: '/performance',
    name: 'Performance',
    component: Performance,
    props: true
  }


]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
