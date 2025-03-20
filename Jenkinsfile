// pipeline {
//     agent any

//     environment {
//         SONARQUBE_SERVER = 'sonarqube'
//         NEXUS_REPO_URL = '192.168.1.65:8082'  // No http://
//         IMAGE_NAME = 'docker-repo/fe_demo'
//         IMAGE_VERSION = "v0.1"
//         CONTAINER_NAME = "fe_demo_container"
//     }

//     stages {
//         stage('Clone Repository') {
//             steps {
//                 git branch: 'dev', credentialsId: 'new-git-id', url: 'https://github.com/naveen-realtek/fe_demo.git'
//             }
//         }

//         stage('SonarQube Analysis') {
//             steps {
//                 withSonarQubeEnv(SONARQUBE_SERVER) {
//                     withCredentials([string(credentialsId: 'sonar_id', variable: 'SONAR_TOKEN')]) {
//                         sh '''
//                         /opt/sonar-scanner/bin/sonar-scanner \
//                         -Dsonar.projectKey=fe_demo \
//                         -Dsonar.projectName="Fe_Demo" \
//                         -Dsonar.sources=src \
//                         -Dsonar.host.url=http://192.168.1.65:9000 \
//                         -Dsonar.login=$SONAR_TOKEN
//                         '''
//                     }
//                 }
//             }
//         }

//         stage('Get Latest Image Version') {
//             steps {
//                 withCredentials([usernamePassword(credentialsId: 'nexus_docker_id', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
//                     script {
//                         def latestTag = sh(
//                             script: """
//                                 curl -s -u "$NEXUS_USER:$NEXUS_PASS" http://${NEXUS_REPO_URL}/v2/${IMAGE_NAME}/tags/list | 
//                                 jq -r '.tags | if type == "array" and length > 0 then sort | last else empty end'
//                             """,
//                             returnStdout: true
//                         ).trim()

//                         if (latestTag && latestTag.startsWith("v")) {
//                             def parts = latestTag.tokenize('.')
//                             env.IMAGE_VERSION = "v0." + (parts[1].toInteger() + 1)
//                         }

//                         echo "New image version: ${env.IMAGE_VERSION}"
//                     }
//                 }
//             }
//         }

//         stage('Build Docker Image') {
//             steps {
//                 script {
//                     sh "docker build -t ${IMAGE_NAME}:${IMAGE_VERSION} ."
//                 }
//             }
//         }

//         stage('Push to Nexus') {
//             steps {
//                 withCredentials([usernamePassword(credentialsId: 'nexus_docker_id', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
//                     script {
//                         echo "Logging into Nexus..."
//                         sh 'echo "$NEXUS_PASS" | docker login -u "$NEXUS_USER" --password-stdin ' + NEXUS_REPO_URL

//                         echo "Tagging Docker Image..."
//                         sh "docker tag ${IMAGE_NAME}:${IMAGE_VERSION} ${NEXUS_REPO_URL}/${IMAGE_NAME}:${IMAGE_VERSION}"

//                         echo "Pushing Docker Image to Nexus..."
//                         sh "docker push ${NEXUS_REPO_URL}/${IMAGE_NAME}:${IMAGE_VERSION}"
//                     }
//                 }
//             }
//         }

//         stage('Pull & Remove Old Image') {
//             steps {
//                 script {
//                     echo "Pulling latest image..."
//                     sh "docker pull ${NEXUS_REPO_URL}/${IMAGE_NAME}:${IMAGE_VERSION}"

//                     echo "Fetching previous image version..."
//                     def previousImage = sh(
//                         script: """
//                         docker images --format '{{.Repository}}:{{.Tag}} {{.ID}}' | grep '${NEXUS_REPO_URL}/${IMAGE_NAME}' | sort | tail -n 2 | head -n 1 | awk '{print \$1}'
//                         """,
//                         returnStdout: true
//                     ).trim()

//                     if (previousImage) {
//                         echo "Stopping and removing old container..."
//                         sh """
//                         docker stop ${CONTAINER_NAME} || true
//                         docker rm ${CONTAINER_NAME} || true
//                         """

//                         echo "Removing previous image: ${previousImage}"
//                         sh "docker rmi -f ${previousImage} || true"
//                     } else {
//                         echo "No previous image found to remove."
//                     }
//                 }
//             }
//         }

//         stage('Deploy New Container') {
//             steps {
//                 script {
//                     echo "Running new container..."
//                     sh """
//                     docker run -d --name ${CONTAINER_NAME} -p 4001:4001 ${NEXUS_REPO_URL}/${IMAGE_NAME}:${IMAGE_VERSION}
//                     """
//                 }
//             }
//         }
//     }

//     post {
//         failure {
//             script {
//                 echo "Pipeline execution failed!"
//             }
//         }
//     }
// }

node {
    def SONARQUBE_SERVER = 'sonarqube'
    def NEXUS_REPO_URL = '192.168.1.65:8082'  // No http://
    def IMAGE_NAME = 'docker-repo/fe_demo'
    def IMAGE_VERSION = "v0.1"
    def CONTAINER_NAME = "fe_demo_container"
    
    stage('Clone Repository') {
        git branch: 'dev', credentialsId: 'new-git-id', url: 'https://github.com/naveen-realtek/fe_demo.git'
    }
    
    stage('SonarQube Analysis') {
        withSonarQubeEnv(SONARQUBE_SERVER) {
            withCredentials([string(credentialsId: 'sonar_id', variable: 'SONAR_TOKEN')]) {
                sh '''
                /opt/sonar-scanner/bin/sonar-scanner \
                -Dsonar.projectKey=fe_demo \
                -Dsonar.projectName="Fe_Demo" \
                -Dsonar.sources=src \
                -Dsonar.host.url=http://192.168.1.65:9000 \
                -Dsonar.login=$SONAR_TOKEN
                '''
            }
        }
    }
    
    stage('Get Latest Image Version') {
        withCredentials([usernamePassword(credentialsId: 'nexus_docker_id', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
            def latestTag = sh(
                script: """
                    curl -s -u "$NEXUS_USER:$NEXUS_PASS" http://${NEXUS_REPO_URL}/v2/${IMAGE_NAME}/tags/list | 
                    jq -r '.tags | if type == "array" and length > 0 then sort | last else empty end'
                """,
                returnStdout: true
            ).trim()
            
            if (latestTag && latestTag.startsWith("v")) {
                def parts = latestTag.tokenize('.')
                IMAGE_VERSION = "v0." + (parts[1].toInteger() + 1)
            }
            
            echo "New image version: ${IMAGE_VERSION}"
        }
    }
    
    stage('Build Docker Image') {
        sh "docker build -t ${IMAGE_NAME}:${IMAGE_VERSION} ."
    }
    
    stage('Push to Nexus') {
        withCredentials([usernamePassword(credentialsId: 'nexus_docker_id', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
            echo "Logging into Nexus..."
            sh 'echo "$NEXUS_PASS" | docker login -u "$NEXUS_USER" --password-stdin ' + NEXUS_REPO_URL
            
            echo "Tagging Docker Image..."
            sh "docker tag ${IMAGE_NAME}:${IMAGE_VERSION} ${NEXUS_REPO_URL}/${IMAGE_NAME}:${IMAGE_VERSION}"
            
            echo "Pushing Docker Image to Nexus..."
            sh "docker push ${NEXUS_REPO_URL}/${IMAGE_NAME}:${IMAGE_VERSION}"
        }
    }
    
    stage('Pull & Remove Old Image') {
        echo "Pulling latest image..."
        sh "docker pull ${NEXUS_REPO_URL}/${IMAGE_NAME}:${IMAGE_VERSION}"
        
        echo "Fetching previous image version..."
        def previousImage = sh(
            script: """
            docker images --format '{{.Repository}}:{{.Tag}} {{.ID}}' | grep '${NEXUS_REPO_URL}/${IMAGE_NAME}' | sort | tail -n 2 | head -n 1 | awk '{print \$1}'
            """,
            returnStdout: true
        ).trim()
        
        if (previousImage) {
            echo "Stopping and removing old container..."
            sh """
            docker stop ${CONTAINER_NAME} || true
            docker rm ${CONTAINER_NAME} || true
            """
            
            echo "Removing previous image: ${previousImage}"
            sh "docker rmi -f ${previousImage} || true"
        } else {
            echo "No previous image found to remove."
        }
    }
    
    stage('Deploy New Container') {
        echo "Running new container..."
        sh """
        docker run -d --name ${CONTAINER_NAME} -p 4001:4001 ${NEXUS_REPO_URL}/${IMAGE_NAME}:${IMAGE_VERSION}
        """
    }
    
    catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
        echo "Pipeline execution failed!"
    }
}
