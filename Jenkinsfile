node {
    environment {
        SONARQUBE_SERVER = 'sonarqube'
        NEXUS_REPO_URL = '192.168.1.65:8082'
        IMAGE_NAME = 'docker-repo/fe_admin'
        IMAGE_VERSION = "v0.1"
        CONTAINER_NAME = "fe_admin_container"
    }

    try {
        stage('Clone Repository') {
            git branch: 'dev', credentialsId: 'new-git-id', url: 'https://github.com/Zinnext/Fe_-Admin_DevOps.git'
        }

        stage('SonarQube Analysis') {
            withSonarQubeEnv(SONARQUBE_SERVER) {
                withCredentials([string(credentialsId: 'sonar_id', variable: 'SONAR_TOKEN')]) {
                    sh '''
                    /opt/sonar-scanner/bin/sonar-scanner \
                    -Dsonar.projectKey=fe_admin \
                    -Dsonar.projectName="Fe_Admin" \
                    -Dsonar.sources=src \
                    -Dsonar.host.url=http://192.168.1.65:9000 \
                    -Dsonar.login=$SONAR_TOKEN
                    '''
                }
            }
        }

        stage('Get Latest Image Version') {
            withCredentials([usernamePassword(credentialsId: 'nexus_docker_id', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                script {
                    def latestTag = sh(script: '''
                        curl -s -u "$NEXUS_USER:$NEXUS_PASS" http://${NEXUS_REPO_URL}/v2/${IMAGE_NAME}/tags/list | \
                        jq -r '.tags | if type == "array" and length > 0 then sort | last else empty end'
                    ''', returnStdout: true).trim()

                    if (latestTag && latestTag.startsWith("v")) {
                        def parts = latestTag.tokenize('.')
                        IMAGE_VERSION = "v0." + (parts[1].toInteger() + 1)
                    }
                    echo "New image version: ${IMAGE_VERSION}"
                }
            }
        }

        stage('Build Docker Image') {
            sh "docker build -t ${IMAGE_NAME}:${IMAGE_VERSION} ."
        }

        stage('Push to Nexus') {
            withCredentials([usernamePassword(credentialsId: 'nexus_docker_id', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                script {
                    sh 'echo "$NEXUS_PASS" | docker login -u "$NEXUS_USER" --password-stdin ' + NEXUS_REPO_URL
                    sh "docker tag ${IMAGE_NAME}:${IMAGE_VERSION} ${NEXUS_REPO_URL}/${IMAGE_NAME}:${IMAGE_VERSION}"
                    sh "docker push ${NEXUS_REPO_URL}/${IMAGE_NAME}:${IMAGE_VERSION}"
                }
            }
        }

        stage('Pull & Remove Old Image') {
            script {
                sh "docker pull ${NEXUS_REPO_URL}/${IMAGE_NAME}:${IMAGE_VERSION}"
                def previousImage = sh(script: '''
                    docker images --format '{{.Repository}}:{{.Tag}} {{.ID}}' | \
                    grep '${NEXUS_REPO_URL}/${IMAGE_NAME}' | sort | tail -n 2 | head -n 1 | awk '{print $1}'
                ''', returnStdout: true).trim()

                if (previousImage) {
                    sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                    docker rmi -f ${previousImage} || true
                    """
                }
            }
        }

        stage('Deploy New Container') {
            sh "docker run -d --name ${CONTAINER_NAME} -p 4001:4001 ${NEXUS_REPO_URL}/${IMAGE_NAME}:${IMAGE_VERSION}"
        }
    } catch (Exception e) {
        echo "Pipeline execution failed! Error: ${e.getMessage()}"
        currentBuild.result = 'FAILURE'
    }
}
